import json
import os
import base64
import re
from datetime import datetime

import boto3
import psycopg2


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

PLATFORMS = ('windows', 'macos')


def _schema():
    return os.environ.get('MAIN_DB_SCHEMA', 'public')


def _conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _esc(value: str) -> str:
    return str(value).replace("'", "''")


def _version_key(version: str):
    parts = re.findall(r'\d+', version or '')
    nums = [int(p) for p in parts[:4]]
    while len(nums) < 4:
        nums.append(0)
    return tuple(nums)


def _response(status: int, payload: dict) -> dict:
    return {
        'statusCode': status,
        'headers': CORS,
        'isBase64Encoded': False,
        'body': json.dumps(payload, ensure_ascii=False, default=str),
    }


def _list_releases():
    schema = _schema()
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, version, platform, file_url, file_name, file_size, notes, downloads, created_at "
                f"FROM {schema}.app_releases WHERE is_published = TRUE ORDER BY created_at DESC LIMIT 200"
            )
            rows = cur.fetchall()

    releases = [
        {
            'id': r[0],
            'version': r[1],
            'platform': r[2],
            'fileUrl': r[3],
            'fileName': r[4],
            'fileSize': int(r[5] or 0),
            'notes': r[6] or '',
            'downloads': int(r[7] or 0),
            'createdAt': r[8].isoformat() if r[8] else None,
        }
        for r in rows
    ]

    latest = {}
    for platform in PLATFORMS:
        items = [x for x in releases if x['platform'] == platform]
        if items:
            items.sort(key=lambda x: (_version_key(x['version']), x['createdAt'] or ''), reverse=True)
            latest[platform] = items[0]

    return {'releases': releases, 'latest': latest}


def _upload(body: dict, headers: dict):
    admin_token = os.environ.get('ADMIN_TOKEN', '')
    sent = headers.get('x-admin-token') or headers.get('X-Admin-Token') or ''
    if not admin_token or sent != admin_token:
        return _response(403, {'error': 'Неверный пароль администратора'})

    version = (body.get('version') or '').strip()
    platform = (body.get('platform') or '').strip().lower()
    file_name = (body.get('fileName') or '').strip()
    notes = (body.get('notes') or '').strip()
    file_b64 = body.get('fileBase64') or ''

    if not version:
        return _response(400, {'error': 'Укажите номер версии'})
    if platform not in PLATFORMS:
        return _response(400, {'error': 'Платформа должна быть windows или macos'})
    if not file_name or not file_b64:
        return _response(400, {'error': 'Прикрепите файл установщика'})

    if ',' in file_b64[:80] and file_b64.strip().startswith('data:'):
        file_b64 = file_b64.split(',', 1)[1]

    data = base64.b64decode(file_b64)
    safe_name = re.sub(r'[^A-Za-z0-9._-]', '_', file_name)
    key = f"releases/{platform}/{version}/{safe_name}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=data, ContentType='application/octet-stream')
    file_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    schema = _schema()
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT INTO {schema}.app_releases (version, platform, file_url, file_name, file_size, notes) "
                f"VALUES ('{_esc(version)}', '{_esc(platform)}', '{_esc(file_url)}', '{_esc(safe_name)}', {len(data)}, '{_esc(notes)}') "
                f"RETURNING id"
            )
            new_id = cur.fetchone()[0]
        conn.commit()

    return _response(200, {
        'ok': True,
        'id': new_id,
        'version': version,
        'platform': platform,
        'fileUrl': file_url,
        'fileSize': len(data),
    })


def _count_download(body: dict):
    release_id = body.get('id')
    if not isinstance(release_id, int):
        return _response(400, {'error': 'Некорректный идентификатор'})
    schema = _schema()
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {schema}.app_releases SET downloads = downloads + 1 WHERE id = {release_id}"
            )
        conn.commit()
    return _response(200, {'ok': True})


def handler(event: dict, context) -> dict:
    """Хранит версии приложения MBA: отдаёт список релизов и последние версии для Windows и macOS, принимает загрузку нового установщика и считает скачивания."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    if method == 'GET':
        return _response(200, _list_releases())

    if method == 'POST':
        raw = event.get('body') or '{}'
        try:
            body = json.loads(raw)
        except json.JSONDecodeError:
            return _response(400, {'error': 'Некорректный запрос'})

        action = body.get('action') or 'upload'
        headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}

        if action == 'download':
            return _count_download(body)
        return _upload(body, headers)

    return _response(405, {'error': 'Метод не поддерживается'})

import json
import os
import base64
import re
import hashlib

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


def _esc(value) -> str:
    return str(value).replace("'", "''")


def _version_key(version: str):
    nums = [int(p) for p in re.findall(r'\d+', version or '')[:4]]
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


def _rows_to_releases(rows):
    return [
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
            'sha256': r[9] or '',
            'arch': r[10] or '',
            'mandatory': bool(r[11]),
        }
        for r in rows
    ]


def _fetch_all():
    schema = _schema()
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, version, platform, file_url, file_name, file_size, notes, "
                f"downloads, created_at, sha256, arch, mandatory "
                f"FROM {schema}.app_releases WHERE is_published = TRUE "
                f"ORDER BY created_at DESC LIMIT 200"
            )
            return _rows_to_releases(cur.fetchall())


def _latest_map(releases):
    latest = {}
    for platform in PLATFORMS:
        items = [x for x in releases if x['platform'] == platform]
        if items:
            items.sort(key=lambda x: (_version_key(x['version']), x['createdAt'] or ''), reverse=True)
            latest[platform] = items[0]
    return latest


def _list_releases():
    releases = _fetch_all()
    return {'releases': releases, 'latest': _latest_map(releases)}


def _check_update(params: dict):
    """Приложение спрашивает: есть ли версия новее моей?"""
    platform = (params.get('platform') or '').lower()
    current = params.get('version') or '0.0.0'
    arch = (params.get('arch') or '').lower()

    if platform not in PLATFORMS:
        return _response(400, {'error': 'Неизвестная платформа'})

    releases = [r for r in _fetch_all() if r['platform'] == platform]

    if arch:
        matched = [r for r in releases if not r['arch'] or r['arch'] == arch]
        if matched:
            releases = matched

    if not releases:
        return _response(200, {'available': False, 'reason': 'Версий пока нет'})

    releases.sort(key=lambda x: (_version_key(x['version']), x['createdAt'] or ''), reverse=True)
    newest = releases[0]

    if _version_key(newest['version']) <= _version_key(current):
        return _response(200, {'available': False, 'version': newest['version']})

    return _response(200, {
        'available': True,
        'id': newest['id'],
        'version': newest['version'],
        'notes': newest['notes'],
        'fileUrl': newest['fileUrl'],
        'fileName': newest['fileName'],
        'fileSize': newest['fileSize'],
        'sha256': newest['sha256'],
        'mandatory': newest['mandatory'],
        'releasedAt': newest['createdAt'],
    })


def _upload(body: dict, headers: dict):
    admin_token = os.environ.get('ADMIN_TOKEN', '')
    sent = headers.get('x-admin-token') or ''
    if not admin_token or sent != admin_token:
        return _response(403, {'error': 'Неверный пароль администратора'})

    version = (body.get('version') or '').strip()
    platform = (body.get('platform') or '').strip().lower()
    file_name = (body.get('fileName') or '').strip()
    notes = (body.get('notes') or '').strip()
    arch = (body.get('arch') or '').strip().lower()
    mandatory = bool(body.get('mandatory'))
    file_b64 = body.get('fileBase64') or ''

    if not version:
        return _response(400, {'error': 'Укажите номер версии'})
    if platform not in PLATFORMS:
        return _response(400, {'error': 'Платформа должна быть windows или macos'})
    if not file_name or not file_b64:
        return _response(400, {'error': 'Прикрепите файл установщика'})

    if file_b64.strip().startswith('data:') and ',' in file_b64[:80]:
        file_b64 = file_b64.split(',', 1)[1]

    data = base64.b64decode(file_b64)
    checksum = hashlib.sha256(data).hexdigest()

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
                f"INSERT INTO {schema}.app_releases "
                f"(version, platform, file_url, file_name, file_size, notes, sha256, arch, mandatory) "
                f"VALUES ('{_esc(version)}', '{_esc(platform)}', '{_esc(file_url)}', "
                f"'{_esc(safe_name)}', {len(data)}, '{_esc(notes)}', '{_esc(checksum)}', "
                f"'{_esc(arch)}', {'TRUE' if mandatory else 'FALSE'}) RETURNING id"
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
        'sha256': checksum,
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
    """Хранит версии приложения MBA: отдаёт список релизов, проверяет наличие обновления для установленного приложения, принимает загрузку нового установщика и считает скачивания."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}

    if method == 'GET':
        if params.get('action') == 'check':
            return _check_update(params)
        return _response(200, _list_releases())

    if method == 'POST':
        try:
            body = json.loads(event.get('body') or '{}')
        except json.JSONDecodeError:
            return _response(400, {'error': 'Некорректный запрос'})

        headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
        action = body.get('action') or 'upload'

        if action == 'download':
            return _count_download(body)
        return _upload(body, headers)

    return _response(405, {'error': 'Метод не поддерживается'})

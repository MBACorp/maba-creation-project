import json
import time
import socket
import base64
import struct
import urllib.request
from concurrent.futures import ThreadPoolExecutor

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

CHECK_HOST = 'ipinfo.io'
CHECK_PATH = '/json'
TIMEOUT = 3.5


def _response(status: int, payload: dict) -> dict:
    return {
        'statusCode': status,
        'headers': CORS,
        'isBase64Encoded': False,
        'body': json.dumps(payload, ensure_ascii=False),
    }


def _socks5_connect(host, port, user, password, dest_host, dest_port):
    sock = socket.create_connection((host, port), TIMEOUT)
    sock.settimeout(TIMEOUT)

    if user:
        sock.sendall(b'\x05\x02\x00\x02')
    else:
        sock.sendall(b'\x05\x01\x00')

    resp = sock.recv(2)
    if len(resp) < 2 or resp[0] != 5:
        raise RuntimeError('Прокси не отвечает по протоколу SOCKS5')

    method = resp[1]
    if method == 2:
        if not user:
            raise RuntimeError('Прокси требует логин и пароль')
        u = user.encode()
        p = (password or '').encode()
        sock.sendall(b'\x01' + bytes([len(u)]) + u + bytes([len(p)]) + p)
        auth = sock.recv(2)
        if len(auth) < 2 or auth[1] != 0:
            raise RuntimeError('Неверный логин или пароль')
    elif method == 255:
        raise RuntimeError('Прокси отклонил способ авторизации')

    dest = dest_host.encode()
    sock.sendall(b'\x05\x01\x00\x03' + bytes([len(dest)]) + dest + struct.pack('>H', dest_port))
    reply = sock.recv(4)
    if len(reply) < 2 or reply[1] != 0:
        raise RuntimeError('Прокси не смог установить соединение')

    atyp = reply[3] if len(reply) > 3 else 1
    if atyp == 1:
        sock.recv(4)
    elif atyp == 3:
        length = sock.recv(1)[0]
        sock.recv(length)
    elif atyp == 4:
        sock.recv(16)
    sock.recv(2)
    return sock


def _http_get_via_socket(sock, host, path):
    request = f'GET {path} HTTP/1.1\r\nHost: {host}\r\nUser-Agent: MBA\r\nConnection: close\r\nAccept: application/json\r\n\r\n'
    sock.sendall(request.encode())
    chunks = []
    while True:
        data = sock.recv(4096)
        if not data:
            break
        chunks.append(data)
    raw = b''.join(chunks).decode('utf-8', 'ignore')
    if '\r\n\r\n' not in raw:
        raise RuntimeError('Пустой ответ через прокси')
    body = raw.split('\r\n\r\n', 1)[1]
    if body.lstrip().startswith(('1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')) and not body.lstrip().startswith('{'):
        parts = body.split('\r\n')
        body = ''.join(p for p in parts if p.startswith('{') or p.startswith('"') or p.startswith('}') or ':' in p)
    start = body.find('{')
    end = body.rfind('}')
    if start < 0 or end < 0:
        raise RuntimeError('Некорректный ответ через прокси')
    return json.loads(body[start:end + 1])


def _check_socks5(host, port, user, password):
    sock = _socks5_connect(host, port, user, password, CHECK_HOST, 80)
    try:
        return _http_get_via_socket(sock, CHECK_HOST, CHECK_PATH)
    finally:
        sock.close()


def _check_http(host, port, user, password, scheme):
    proxy_url = f'{scheme}://'
    if user:
        proxy_url += f'{user}:{password or ""}@'
    proxy_url += f'{host}:{port}'

    handler = urllib.request.ProxyHandler({'http': proxy_url, 'https': proxy_url})
    opener = urllib.request.build_opener(handler)
    req = urllib.request.Request(
        f'http://{CHECK_HOST}{CHECK_PATH}',
        headers={'User-Agent': 'MBA', 'Accept': 'application/json'},
    )
    if user:
        token = base64.b64encode(f'{user}:{password or ""}'.encode()).decode()
        req.add_header('Proxy-Authorization', f'Basic {token}')
    with opener.open(req, timeout=TIMEOUT) as res:
        return json.loads(res.read().decode('utf-8', 'ignore'))


def _check_one(item: dict) -> dict:
    host = (item.get('host') or '').strip()
    port = item.get('port')
    scheme = (item.get('type') or 'socks5').strip().lower()
    user = (item.get('user') or '').strip() or None
    password = item.get('password') or ''

    result = {'id': item.get('id'), 'host': host, 'port': port, 'type': scheme}

    if not host or not port:
        result.update({'ok': False, 'error': 'Не указан адрес или порт'})
        return result

    started = time.time()
    try:
        if scheme in ('socks5', 'socks4', 'socks'):
            data = _check_socks5(host, int(port), user, password)
        else:
            data = _check_http(host, int(port), user, password, 'http')

        result.update({
            'ok': True,
            'ip': data.get('ip', ''),
            'country': data.get('country', ''),
            'city': data.get('city', ''),
            'region': data.get('region', ''),
            'org': data.get('org', ''),
            'timezone': data.get('timezone', ''),
            'latency': int((time.time() - started) * 1000),
        })
    except Exception as error:
        result.update({
            'ok': False,
            'error': str(error) or 'Прокси недоступен',
            'latency': int((time.time() - started) * 1000),
        })

    return result


def handler(event: dict, context) -> dict:
    """Проверяет доступность прокси: подключается через socks5 или http и возвращает реальный IP, страну, город и скорость отклика."""
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    if method != 'POST':
        return _response(405, {'error': 'Метод не поддерживается'})

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return _response(400, {'error': 'Некорректный запрос'})

    items = body.get('proxies')
    if not isinstance(items, list) or not items:
        return _response(400, {'error': 'Список прокси пуст'})

    batch = items[:10]
    with ThreadPoolExecutor(max_workers=min(10, len(batch))) as pool:
        results = list(pool.map(_check_one, batch))

    return _response(200, {'results': results})
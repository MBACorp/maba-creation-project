export const PROXY_CHECK_URL =
  'https://functions.poehali.dev/56b00264-60c4-47db-a88e-f044d7838678';

export type ProxyType = 'socks5' | 'http' | 'https';

export type ProxyStatus = 'unknown' | 'checking' | 'ok' | 'fail';

export interface ProxyRecord {
  id: string;
  host: string;
  port: number;
  type: ProxyType;
  user?: string;
  password?: string;
  label?: string;
  status: ProxyStatus;
  ip?: string;
  country?: string;
  city?: string;
  org?: string;
  timezone?: string;
  latency?: number;
  error?: string;
  checkedAt?: string;
}

export interface CheckResult {
  id: string;
  ok: boolean;
  ip?: string;
  country?: string;
  city?: string;
  org?: string;
  timezone?: string;
  latency?: number;
  error?: string;
}

export const COUNTRY_NAMES: Record<string, string> = {
  US: 'США',
  GB: 'Великобритания',
  DE: 'Германия',
  FR: 'Франция',
  NL: 'Нидерланды',
  PL: 'Польша',
  ES: 'Испания',
  IT: 'Италия',
  RU: 'Россия',
  UA: 'Украина',
  KZ: 'Казахстан',
  TR: 'Турция',
  CA: 'Канада',
  BR: 'Бразилия',
  IN: 'Индия',
  JP: 'Япония',
  SG: 'Сингапур',
  AE: 'ОАЭ',
  CH: 'Швейцария',
  SE: 'Швеция',
  FI: 'Финляндия',
  CZ: 'Чехия',
  RO: 'Румыния',
  MD: 'Молдова',
  LT: 'Литва',
  LV: 'Латвия',
};

export const flagOf = (code?: string) => {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((c) => 127397 + c.charCodeAt(0)),
  );
};

export const countryName = (code?: string) =>
  code ? COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase() : '';

const TYPES: ProxyType[] = ['socks5', 'http', 'https'];

export const parseProxyLine = (line: string): Omit<ProxyRecord, 'id' | 'status'> | null => {
  const raw = line.trim();
  if (!raw) return null;

  let type: ProxyType = 'socks5';
  let rest = raw;

  const schemeMatch = raw.match(/^(socks5|socks|http|https):\/\/(.+)$/i);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    type = (scheme === 'socks' ? 'socks5' : scheme) as ProxyType;
    rest = schemeMatch[2];
  }

  let user: string | undefined;
  let password: string | undefined;

  if (rest.includes('@')) {
    const [creds, address] = rest.split('@');
    const [u, p] = creds.split(':');
    user = u || undefined;
    password = p || undefined;
    rest = address;
  }

  const parts = rest.split(':').filter(Boolean);
  if (parts.length < 2) return null;

  const [host, portRaw, u2, p2] = parts;
  const port = Number(portRaw);
  if (!host || !Number.isFinite(port) || port < 1 || port > 65535) return null;

  if (u2 && !user) {
    user = u2;
    password = p2;
  }

  if (!TYPES.includes(type)) type = 'socks5';

  return { host, port, type, user, password };
};

export const parseProxyList = (text: string) => {
  const lines = text.split(/[\n,;]+/);
  const valid: Omit<ProxyRecord, 'id' | 'status'>[] = [];
  const invalid: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const parsed = parseProxyLine(trimmed);
    if (parsed) valid.push(parsed);
    else invalid.push(trimmed);
  });

  return { valid, invalid };
};

export const proxyLabel = (p: ProxyRecord) =>
  p.label || `${p.host}:${p.port}`;

export const checkProxies = async (
  proxies: ProxyRecord[],
): Promise<CheckResult[]> => {
  const res = await fetch(PROXY_CHECK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proxies: proxies.map((p) => ({
        id: p.id,
        host: p.host,
        port: p.port,
        type: p.type,
        user: p.user,
        password: p.password,
      })),
    }),
  });
  if (!res.ok) throw new Error('Сервис проверки недоступен');
  const data = await res.json();
  return data.results || [];
};

export const proxySeed: ProxyRecord[] = [
  { id: 'x1', host: '46.17.43.24', port: 1080, type: 'socks5', status: 'unknown' },
  { id: 'x2', host: '217.182.193.11', port: 1085, type: 'socks5', status: 'unknown' },
  { id: 'x3', host: '91.214.68.7', port: 8080, type: 'http', status: 'unknown' },
];

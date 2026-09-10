export interface CookieRecord {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

export interface DomainStat {
  domain: string;
  count: number;
  expired: number;
  session: number;
}

export interface CookieSummary {
  total: number;
  domains: DomainStat[];
}

export const EMPTY_SUMMARY: CookieSummary = { total: 0, domains: [] };

const normalizeSameSite = (value?: string) => {
  const v = String(value || '').toLowerCase();
  if (v === 'lax') return 'Lax';
  if (v === 'strict') return 'Strict';
  if (v === 'none' || v === 'no_restriction') return 'None';
  return 'Lax';
};

type RawCookie = Record<string, unknown>;

const normalize = (raw: RawCookie): CookieRecord | null => {
  if (!raw || !raw.name) return null;
  const domain = String(raw.domain || raw.host || '').trim();
  if (!domain) return null;

  const expiresRaw =
    raw.expirationDate || raw.expires || raw.expiry || raw.expires_utc || 0;

  return {
    name: String(raw.name),
    value: raw.value == null ? '' : String(raw.value),
    domain,
    path: String(raw.path || '/'),
    expires: expiresRaw ? Math.floor(Number(expiresRaw)) : -1,
    httpOnly: Boolean(raw.httpOnly || raw.http_only),
    secure: Boolean(raw.secure),
    sameSite: normalizeSameSite(raw.sameSite as string),
  };
};

const parseNetscape = (text: string): CookieRecord[] => {
  const out: CookieRecord[] = [];
  text.split(/\r?\n/).forEach((line) => {
    const clean = line.trim();
    if (!clean || (clean.startsWith('#') && !clean.startsWith('#HttpOnly_'))) return;

    let row = clean;
    let httpOnly = false;
    if (row.startsWith('#HttpOnly_')) {
      httpOnly = true;
      row = row.slice('#HttpOnly_'.length);
    }

    const parts = row.split('\t');
    if (parts.length < 7) return;

    const [domain, , cookiePath, secure, expires, name, ...valueParts] = parts;
    const cookie = normalize({
      domain,
      path: cookiePath,
      secure: String(secure).toUpperCase() === 'TRUE',
      expirationDate: Number(expires) || 0,
      name,
      value: valueParts.join('\t'),
      httpOnly,
    });
    if (cookie) out.push(cookie);
  });
  return out;
};

export const parseCookies = (text: string): CookieRecord[] => {
  const trimmed = String(text || '').trim();
  if (!trimmed) throw new Error('Файл пустой');

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const data = JSON.parse(trimmed);
    const list = Array.isArray(data) ? data : data.cookies || data.data || [];
    if (!Array.isArray(list)) throw new Error('В файле нет списка куки');
    return list.map(normalize).filter(Boolean) as CookieRecord[];
  }

  const netscape = parseNetscape(trimmed);
  if (!netscape.length) throw new Error('Формат файла не распознан');
  return netscape;
};

export const summarize = (cookies: CookieRecord[]): CookieSummary => {
  const map = new Map<string, DomainStat>();
  const now = Date.now() / 1000;

  cookies.forEach((c) => {
    const domain = c.domain.replace(/^\./, '');
    const item = map.get(domain) || { domain, count: 0, expired: 0, session: 0 };
    item.count += 1;
    if (c.expires === -1 || !c.expires) item.session += 1;
    else if (c.expires < now) item.expired += 1;
    map.set(domain, item);
  });

  return {
    total: cookies.length,
    domains: [...map.values()].sort(
      (a, b) => b.count - a.count || a.domain.localeCompare(b.domain),
    ),
  };
};

export const toNetscape = (cookies: CookieRecord[]) => {
  const lines = ['# Netscape HTTP Cookie File', '# Экспортировано из MBA', ''];
  cookies.forEach((c) => {
    const prefix = c.httpOnly ? '#HttpOnly_' : '';
    lines.push(
      [
        prefix + c.domain,
        c.domain.startsWith('.') ? 'TRUE' : 'FALSE',
        c.path || '/',
        c.secure ? 'TRUE' : 'FALSE',
        c.expires > 0 ? String(c.expires) : '0',
        c.name,
        c.value,
      ].join('\t'),
    );
  });
  return lines.join('\n');
};

export const downloadFile = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

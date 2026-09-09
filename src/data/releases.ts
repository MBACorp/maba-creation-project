export const RELEASES_URL =
  'https://functions.poehali.dev/64796028-131f-48ee-b46a-6712a0fec33f';

export type Platform = 'windows' | 'macos';

export interface Release {
  id: number;
  version: string;
  platform: Platform;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  notes: string;
  downloads: number;
  createdAt: string | null;
}

export interface ReleasesData {
  releases: Release[];
  latest: Partial<Record<Platform, Release>>;
}

export const PLATFORM_META: Record<
  Platform,
  { title: string; icon: string; hint: string; ext: string }
> = {
  windows: {
    title: 'Windows',
    icon: 'Monitor',
    hint: 'Windows 10 и 11, 64-bit',
    ext: '.exe',
  },
  macos: {
    title: 'macOS',
    icon: 'Apple',
    hint: 'macOS 12+, Intel и Apple Silicon',
    ext: '.dmg',
  },
};

export const formatSize = (bytes: number) => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${mb.toFixed(1)} МБ`;
};

export const formatDate = (iso: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const detectPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'macos';
  return 'windows';
};

export const fetchReleases = async (): Promise<ReleasesData> => {
  const res = await fetch(RELEASES_URL);
  if (!res.ok) throw new Error('Не удалось загрузить список версий');
  return res.json();
};

export const countDownload = (id: number) => {
  fetch(RELEASES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'download', id }),
  }).catch(() => undefined);
};

export interface FingerprintOverride {
  os?: 'win' | 'mac';
  screen?: string;
  gpu?: string;
  timezone?: string;
  locale?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

export const AUTO = 'auto';

export const OS_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: 'win', label: 'Windows' },
  { value: 'mac', label: 'macOS' },
];

export const SCREEN_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '1920x1080', label: '1920 × 1080 — Full HD' },
  { value: '1536x864', label: '1536 × 864' },
  { value: '1440x900', label: '1440 × 900' },
  { value: '1366x768', label: '1366 × 768' },
  { value: '2560x1440', label: '2560 × 1440 — 2K' },
];

export const GPU_OPTIONS = [
  { value: AUTO, label: 'Автоматически', os: 'any' },
  { value: 'nvidia-rtx3060', label: 'NVIDIA GeForce RTX 3060', os: 'win' },
  { value: 'nvidia-gtx1650', label: 'NVIDIA GeForce GTX 1650', os: 'win' },
  { value: 'intel-uhd630', label: 'Intel UHD Graphics 630', os: 'win' },
  { value: 'intel-iris', label: 'Intel Iris Xe Graphics', os: 'win' },
  { value: 'amd-rx6600', label: 'AMD Radeon RX 6600', os: 'win' },
  { value: 'apple-m1', label: 'Apple M1', os: 'mac' },
  { value: 'apple-m2pro', label: 'Apple M2 Pro', os: 'mac' },
  { value: 'apple-m3', label: 'Apple M3', os: 'mac' },
];

export const TIMEZONE_OPTIONS = [
  { value: AUTO, label: 'По стране прокси' },
  { value: 'America/New_York', label: 'Нью-Йорк — UTC−5' },
  { value: 'America/Chicago', label: 'Чикаго — UTC−6' },
  { value: 'America/Denver', label: 'Денвер — UTC−7' },
  { value: 'America/Los_Angeles', label: 'Лос-Анджелес — UTC−8' },
  { value: 'Europe/London', label: 'Лондон — UTC+0' },
  { value: 'Europe/Berlin', label: 'Берлин — UTC+1' },
  { value: 'Europe/Paris', label: 'Париж — UTC+1' },
  { value: 'Europe/Amsterdam', label: 'Амстердам — UTC+1' },
  { value: 'Europe/Warsaw', label: 'Варшава — UTC+1' },
  { value: 'Europe/Moscow', label: 'Москва — UTC+3' },
  { value: 'Asia/Dubai', label: 'Дубай — UTC+4' },
];

export const LOCALE_OPTIONS = [
  { value: AUTO, label: 'По стране прокси' },
  { value: 'en-US', label: 'Английский — США' },
  { value: 'en-GB', label: 'Английский — Великобритания' },
  { value: 'de-DE', label: 'Немецкий' },
  { value: 'fr-FR', label: 'Французский' },
  { value: 'nl-NL', label: 'Нидерландский' },
  { value: 'pl-PL', label: 'Польский' },
  { value: 'es-ES', label: 'Испанский' },
  { value: 'ru-RU', label: 'Русский' },
];

export const CORES_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '4', label: '4 ядра' },
  { value: '8', label: '8 ядер' },
  { value: '12', label: '12 ядер' },
  { value: '16', label: '16 ядер' },
];

export const MEMORY_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '4', label: '4 ГБ' },
  { value: '8', label: '8 ГБ' },
  { value: '16', label: '16 ГБ' },
  { value: '32', label: '32 ГБ' },
];

export const countOverrides = (fp?: FingerprintOverride) =>
  fp ? Object.values(fp).filter((v) => v !== undefined && v !== AUTO).length : 0;

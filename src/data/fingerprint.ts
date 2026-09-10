export interface FingerprintOverride {
  os?: 'win' | 'mac';
  screen?: string;
  gpu?: string;
  timezone?: string;
  locale?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  geoAuto?: boolean;
}

export const AUTO = 'auto';

export const OS_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: 'win', label: 'Windows' },
  { value: 'mac', label: 'macOS' },
];

export const SCREEN_OPTIONS = [
  { value: AUTO, label: 'Автоматически', os: 'any' },
  { value: '1920x1080', label: '1920 × 1080 — Full HD', os: 'win' },
  { value: '1536x864', label: '1536 × 864 — ноутбук', os: 'win' },
  { value: '1366x768', label: '1366 × 768 — ноутбук', os: 'win' },
  { value: '1600x900', label: '1600 × 900', os: 'win' },
  { value: '2560x1440', label: '2560 × 1440 — 2K', os: 'win' },
  { value: '3840x2160', label: '3840 × 2160 — 4K', os: 'win' },
  { value: '1470x956', label: '1470 × 956 — MacBook Air', os: 'mac' },
  { value: '1512x982', label: '1512 × 982 — MacBook 14"', os: 'mac' },
  { value: '1728x1117', label: '1728 × 1117 — MacBook 16"', os: 'mac' },
];

/*
 * Видеокарты соответствуют реальным комплектам устройств.
 * Выбор видеокарты задаёт всю машину целиком: экран, ядра, память, шрифты.
 */
export const GPU_OPTIONS = [
  { value: AUTO, label: 'Автоматически', os: 'any' },
  { value: 'nvidia-rtx3060', label: 'NVIDIA RTX 3060 — игровой ПК', os: 'win' },
  { value: 'nvidia-gtx1650', label: 'NVIDIA GTX 1650 — домашний ПК', os: 'win' },
  { value: 'intel-uhd630', label: 'Intel UHD 630 — офисный ПК', os: 'win' },
  { value: 'intel-iris', label: 'Intel Iris Xe — ноутбук', os: 'win' },
  { value: 'amd-rx6600', label: 'AMD RX 6600 — игровой ПК', os: 'win' },
  { value: 'apple-m1', label: 'Apple M1 — MacBook Air', os: 'mac' },
  { value: 'apple-m2pro', label: 'Apple M2 Pro — MacBook Pro', os: 'mac' },
  { value: 'apple-m3', label: 'Apple M3 — MacBook Pro', os: 'mac' },
];

/* Допустимые ядра и память для каждой машины — чтобы не выпало 4 ядра у M2 Pro */
export const DEVICE_SPECS: Record<string, { cores: number[]; memory: number[] }> = {
  'nvidia-rtx3060': { cores: [8, 12, 16], memory: [16, 32] },
  'nvidia-gtx1650': { cores: [4, 6, 8], memory: [8, 16] },
  'intel-uhd630': { cores: [4, 6, 8], memory: [8, 16] },
  'intel-iris': { cores: [8, 12], memory: [8, 16] },
  'amd-rx6600': { cores: [8, 12], memory: [16, 32] },
  'apple-m1': { cores: [8], memory: [8, 16] },
  'apple-m2pro': { cores: [10, 12], memory: [16, 32] },
  'apple-m3': { cores: [8, 11], memory: [16, 24] },
};

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
  { value: 'Europe/Madrid', label: 'Мадрид — UTC+1' },
  { value: 'Europe/Rome', label: 'Рим — UTC+1' },
  { value: 'Europe/Zurich', label: 'Цюрих — UTC+1' },
  { value: 'Europe/Vienna', label: 'Вена — UTC+1' },
  { value: 'Europe/Brussels', label: 'Брюссель — UTC+1' },
  { value: 'Europe/Stockholm', label: 'Стокгольм — UTC+1' },
  { value: 'Europe/Oslo', label: 'Осло — UTC+1' },
  { value: 'Europe/Copenhagen', label: 'Копенгаген — UTC+1' },
  { value: 'Europe/Prague', label: 'Прага — UTC+1' },
  { value: 'Europe/Helsinki', label: 'Хельсинки — UTC+2' },
  { value: 'Europe/Bucharest', label: 'Бухарест — UTC+2' },
  { value: 'Europe/Kyiv', label: 'Киев — UTC+2' },
  { value: 'Europe/Chisinau', label: 'Кишинёв — UTC+2' },
  { value: 'Europe/Vilnius', label: 'Вильнюс — UTC+2' },
  { value: 'Europe/Riga', label: 'Рига — UTC+2' },
  { value: 'Europe/Tallinn', label: 'Таллин — UTC+2' },
  { value: 'Europe/Istanbul', label: 'Стамбул — UTC+3' },
  { value: 'Europe/Moscow', label: 'Москва — UTC+3' },
  { value: 'Asia/Dubai', label: 'Дубай — UTC+4' },
  { value: 'Asia/Almaty', label: 'Алматы — UTC+5' },
  { value: 'Asia/Kolkata', label: 'Дели — UTC+5:30' },
  { value: 'Asia/Singapore', label: 'Сингапур — UTC+8' },
  { value: 'Asia/Tokyo', label: 'Токио — UTC+9' },
  { value: 'Australia/Sydney', label: 'Сидней — UTC+11' },
  { value: 'America/Toronto', label: 'Торонто — UTC−5' },
  { value: 'America/Phoenix', label: 'Финикс — UTC−7' },
  { value: 'America/Mexico_City', label: 'Мехико — UTC−6' },
  { value: 'America/Sao_Paulo', label: 'Сан-Паулу — UTC−3' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Буэнос-Айрес — UTC−3' },
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
  { value: 'it-IT', label: 'Итальянский' },
  { value: 'ru-RU', label: 'Русский' },
];

export const CORES_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '4', label: '4 ядра' },
  { value: '6', label: '6 ядер' },
  { value: '8', label: '8 ядер' },
  { value: '10', label: '10 ядер' },
  { value: '11', label: '11 ядер' },
  { value: '12', label: '12 ядер' },
  { value: '16', label: '16 ядер' },
];

export const MEMORY_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '8', label: '8 ГБ' },
  { value: '16', label: '16 ГБ' },
  { value: '24', label: '24 ГБ' },
  { value: '32', label: '32 ГБ' },
];

/* Отфильтровать варианты под выбранную машину, чтобы не собрать невозможную конфигурацию */
export const specOptions = (
  options: { value: string; label: string }[],
  gpu: string,
  key: 'cores' | 'memory',
) => {
  const spec = DEVICE_SPECS[gpu];
  if (!spec) return options;
  const allowed = spec[key].map(String);
  return options.filter((o) => o.value === AUTO || allowed.includes(o.value));
};

export const countOverrides = (fp?: FingerprintOverride) =>
  fp
    ? Object.entries(fp).filter(
        ([key, v]) => key !== 'geoAuto' && v !== undefined && v !== AUTO,
      ).length
    : 0;

export const COUNTRY_GEO: Record<string, { timezone: string; locale: string }> = {
  US: { timezone: 'America/New_York', locale: 'en-US' },
  CA: { timezone: 'America/Toronto', locale: 'en-US' },
  GB: { timezone: 'Europe/London', locale: 'en-GB' },
  DE: { timezone: 'Europe/Berlin', locale: 'de-DE' },
  FR: { timezone: 'Europe/Paris', locale: 'fr-FR' },
  NL: { timezone: 'Europe/Amsterdam', locale: 'nl-NL' },
  PL: { timezone: 'Europe/Warsaw', locale: 'pl-PL' },
  ES: { timezone: 'Europe/Madrid', locale: 'es-ES' },
  IT: { timezone: 'Europe/Rome', locale: 'it-IT' },
  CH: { timezone: 'Europe/Zurich', locale: 'de-DE' },
  AT: { timezone: 'Europe/Vienna', locale: 'de-DE' },
  BE: { timezone: 'Europe/Brussels', locale: 'nl-NL' },
  SE: { timezone: 'Europe/Stockholm', locale: 'en-GB' },
  FI: { timezone: 'Europe/Helsinki', locale: 'en-GB' },
  NO: { timezone: 'Europe/Oslo', locale: 'en-GB' },
  DK: { timezone: 'Europe/Copenhagen', locale: 'en-GB' },
  CZ: { timezone: 'Europe/Prague', locale: 'en-GB' },
  RO: { timezone: 'Europe/Bucharest', locale: 'en-GB' },
  UA: { timezone: 'Europe/Kyiv', locale: 'ru-RU' },
  MD: { timezone: 'Europe/Chisinau', locale: 'ru-RU' },
  LT: { timezone: 'Europe/Vilnius', locale: 'en-GB' },
  LV: { timezone: 'Europe/Riga', locale: 'ru-RU' },
  EE: { timezone: 'Europe/Tallinn', locale: 'ru-RU' },
  RU: { timezone: 'Europe/Moscow', locale: 'ru-RU' },
  KZ: { timezone: 'Asia/Almaty', locale: 'ru-RU' },
  TR: { timezone: 'Europe/Istanbul', locale: 'en-GB' },
  AE: { timezone: 'Asia/Dubai', locale: 'en-GB' },
  IN: { timezone: 'Asia/Kolkata', locale: 'en-GB' },
  SG: { timezone: 'Asia/Singapore', locale: 'en-GB' },
  JP: { timezone: 'Asia/Tokyo', locale: 'en-US' },
  BR: { timezone: 'America/Sao_Paulo', locale: 'es-ES' },
  MX: { timezone: 'America/Mexico_City', locale: 'es-ES' },
  AR: { timezone: 'America/Argentina/Buenos_Aires', locale: 'es-ES' },
  AU: { timezone: 'Australia/Sydney', locale: 'en-GB' },
};

const US_CITY_TZ: Record<string, string> = {
  'new york': 'America/New_York',
  brooklyn: 'America/New_York',
  boston: 'America/New_York',
  miami: 'America/New_York',
  atlanta: 'America/New_York',
  chicago: 'America/Chicago',
  dallas: 'America/Chicago',
  houston: 'America/Chicago',
  austin: 'America/Chicago',
  denver: 'America/Denver',
  phoenix: 'America/Phoenix',
  'salt lake city': 'America/Denver',
  seattle: 'America/Los_Angeles',
  portland: 'America/Los_Angeles',
  'los angeles': 'America/Los_Angeles',
  'san francisco': 'America/Los_Angeles',
  'san jose': 'America/Los_Angeles',
  'san diego': 'America/Los_Angeles',
  'las vegas': 'America/Los_Angeles',
};

export interface GeoSource {
  country?: string;
  city?: string;
  timezone?: string;
}

export const geoToFingerprint = (
  geo: GeoSource,
): { timezone?: string; locale?: string } => {
  const code = (geo.country || '').toUpperCase();
  const base = COUNTRY_GEO[code];
  if (!base && !geo.timezone) return {};

  let timezone = geo.timezone || base?.timezone;

  if (code === 'US' && geo.city) {
    const cityTz = US_CITY_TZ[geo.city.toLowerCase()];
    if (cityTz) timezone = cityTz;
  }

  const known = TIMEZONE_OPTIONS.some((o) => o.value === timezone);
  if (!known && base) timezone = base.timezone;

  return { timezone, locale: base?.locale };
};

export const tzLabel = (value?: string) =>
  TIMEZONE_OPTIONS.find((o) => o.value === value)?.label.split(' — ')[0] || value || '';

export const localeLabel = (value?: string) =>
  LOCALE_OPTIONS.find((o) => o.value === value)?.label || value || '';
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
  { value: 'nvidia-rtx3050-laptop', label: 'Ноутбук с Windows 11 и RTX 3050', os: 'win' },
  { value: 'nvidia-rtx4050-laptop', label: 'Ноутбук с Windows 11 и RTX 4050', os: 'win' },
  { value: 'nvidia-rtx4060-laptop', label: 'Ноутбук с Windows 11 и RTX 4060', os: 'win' },
  { value: 'nvidia-gtx1060', label: 'ПК с Windows 10 и GTX 1060', os: 'win' },
  { value: 'nvidia-gtx1650', label: 'ПК с Windows 10 и GTX 1650', os: 'win' },
  { value: 'nvidia-gtx1660', label: 'ПК с Windows 10 и GTX 1660 Super', os: 'win' },
  { value: 'nvidia-rtx2060', label: 'ПК с Windows 10 и RTX 2060', os: 'win' },
  { value: 'nvidia-rtx3060', label: 'ПК с Windows 11 и RTX 3060', os: 'win' },
  { value: 'nvidia-rtx3070', label: 'ПК с Windows 11 и RTX 3070', os: 'win' },
  { value: 'nvidia-rtx3080', label: 'ПК с Windows 11 и RTX 3080', os: 'win' },
  { value: 'nvidia-rtx4060', label: 'ПК с Windows 11 и RTX 4060', os: 'win' },
  { value: 'nvidia-rtx4060ti', label: 'ПК с Windows 11 и RTX 4060 Ti', os: 'win' },
  { value: 'nvidia-rtx4070', label: 'ПК с Windows 11 и RTX 4070', os: 'win' },
  { value: 'nvidia-rtx4080', label: 'ПК с Windows 11 и RTX 4080', os: 'win' },
  { value: 'nvidia-rtx4090', label: 'ПК с Windows 11 и RTX 4090', os: 'win' },
  { value: 'amd-vega8', label: 'Ноутбук с Windows 10 и AMD Vega', os: 'win' },
  { value: 'amd-780m', label: 'Ноутбук с Windows 11 и AMD Radeon 780M', os: 'win' },
  { value: 'amd-rx580', label: 'ПК с Windows 10 и Radeon RX 580', os: 'win' },
  { value: 'amd-rx6600', label: 'ПК с Windows 11 и Radeon RX 6600', os: 'win' },
  { value: 'amd-rx6700xt', label: 'ПК с Windows 11 и Radeon RX 6700 XT', os: 'win' },
  { value: 'amd-rx7600', label: 'ПК с Windows 11 и Radeon RX 7600', os: 'win' },
  { value: 'amd-rx7800xt', label: 'ПК с Windows 11 и Radeon RX 7800 XT', os: 'win' },
  { value: 'intel-iris', label: 'Ноутбук с Windows 11 и Intel Iris Xe', os: 'win' },
  { value: 'intel-uhd630', label: 'Офисный ПК с Windows 10', os: 'win' },
  { value: 'intel-uhd620', label: 'Офисный ноутбук с Windows 10', os: 'win' },
  { value: 'intel-uhd770', label: 'ПК с Windows 11 без видеокарты', os: 'win' },
  { value: 'intel-arc-a750', label: 'ПК с Windows 11 и Intel Arc A750', os: 'win' },
  { value: 'apple-m2-mini', label: 'Mac mini M2', os: 'mac' },
  { value: 'apple-m1', label: 'MacBook Air M1', os: 'mac' },
  { value: 'apple-m2', label: 'MacBook Air M2', os: 'mac' },
  { value: 'apple-m1max', label: 'MacBook Pro M1 Max', os: 'mac' },
  { value: 'apple-m1pro', label: 'MacBook Pro M1 Pro', os: 'mac' },
  { value: 'apple-m2pro', label: 'MacBook Pro M2 Pro', os: 'mac' },
  { value: 'apple-m3', label: 'MacBook Pro M3', os: 'mac' },
  { value: 'apple-m3max', label: 'MacBook Pro M3 Max', os: 'mac' },
  { value: 'apple-m3pro', label: 'MacBook Pro M3 Pro', os: 'mac' },
  { value: 'apple-m4', label: 'MacBook Pro M4', os: 'mac' },
  { value: 'apple-m4pro', label: 'MacBook Pro M4 Pro', os: 'mac' },
  { value: 'apple-m3-imac', label: 'iMac M3', os: 'mac' },
  { value: 'mac-intel-mbp', label: 'MacBook Pro на Intel', os: 'mac' },
  { value: 'mac-intel-imac', label: 'iMac на Intel', os: 'mac' },
];

/* Допустимые ядра и память для каждой машины — чтобы не выпало 4 ядра у M2 Pro */
export const DEVICE_SPECS: Record<string, { cores: number[]; memory: number[] }> = {
  'amd-780m': { cores: [12, 16], memory: [16, 32] },
  'amd-rx580': { cores: [4, 6, 8], memory: [8, 16] },
  'amd-rx6600': { cores: [8, 12], memory: [16, 32] },
  'amd-rx6700xt': { cores: [8, 12, 16], memory: [16, 32] },
  'amd-rx7600': { cores: [8, 12], memory: [16, 32] },
  'amd-rx7800xt': { cores: [12, 16], memory: [32, 64] },
  'amd-vega8': { cores: [4, 8], memory: [8, 16] },
  'apple-m1': { cores: [8], memory: [8, 16] },
  'apple-m1max': { cores: [10], memory: [32, 64] },
  'apple-m1pro': { cores: [8, 10], memory: [16, 32] },
  'apple-m2': { cores: [8], memory: [8, 16, 24] },
  'apple-m2-mini': { cores: [8], memory: [8, 16, 24] },
  'apple-m2pro': { cores: [10, 12], memory: [16, 32] },
  'apple-m3': { cores: [8, 11], memory: [16, 24] },
  'apple-m3-imac': { cores: [8], memory: [8, 16, 24] },
  'apple-m3max': { cores: [14, 16], memory: [36, 64] },
  'apple-m3pro': { cores: [11, 12], memory: [18, 36] },
  'apple-m4': { cores: [10], memory: [16, 24, 32] },
  'apple-m4pro': { cores: [12, 14], memory: [24, 48] },
  'intel-arc-a750': { cores: [12, 16], memory: [16, 32] },
  'intel-iris': { cores: [8, 12], memory: [8, 16] },
  'intel-uhd620': { cores: [4, 8], memory: [8, 16] },
  'intel-uhd630': { cores: [4, 6, 8], memory: [8, 16] },
  'intel-uhd770': { cores: [8, 12, 16], memory: [16, 32] },
  'mac-intel-imac': { cores: [6, 8], memory: [8, 16] },
  'mac-intel-mbp': { cores: [4, 8], memory: [8, 16] },
  'nvidia-gtx1060': { cores: [4, 6, 8], memory: [8, 16] },
  'nvidia-gtx1650': { cores: [4, 6, 8], memory: [8, 16] },
  'nvidia-gtx1660': { cores: [6, 8, 12], memory: [8, 16] },
  'nvidia-rtx2060': { cores: [6, 8, 12], memory: [16, 32] },
  'nvidia-rtx3050-laptop': { cores: [8, 12], memory: [16] },
  'nvidia-rtx3060': { cores: [8, 12, 16], memory: [16, 32] },
  'nvidia-rtx3070': { cores: [8, 12, 16], memory: [16, 32] },
  'nvidia-rtx3080': { cores: [12, 16], memory: [16, 32] },
  'nvidia-rtx4050-laptop': { cores: [8, 12, 16], memory: [16, 32] },
  'nvidia-rtx4060': { cores: [12, 16], memory: [16, 32] },
  'nvidia-rtx4060-laptop': { cores: [12, 16], memory: [16, 32] },
  'nvidia-rtx4060ti': { cores: [12, 16], memory: [16, 32] },
  'nvidia-rtx4070': { cores: [12, 16], memory: [16, 32] },
  'nvidia-rtx4080': { cores: [16, 24], memory: [32, 64] },
  'nvidia-rtx4090': { cores: [16, 24, 32], memory: [32, 64] },
};

export const TIMEZONE_OPTIONS = [
  { value: AUTO, label: 'По стране прокси' },
  { value: 'Pacific/Honolulu', label: 'Гонолулу — UTC−10' },
  { value: 'America/Anchorage', label: 'Анкоридж — UTC−9' },
  { value: 'America/Vancouver', label: 'Ванкувер — UTC−8' },
  { value: 'America/Los_Angeles', label: 'Лос-Анджелес — UTC−8' },
  { value: 'America/Tijuana', label: 'Тихуана — UTC−8' },
  { value: 'America/Denver', label: 'Денвер — UTC−7' },
  { value: 'America/Phoenix', label: 'Финикс — UTC−7' },
  { value: 'America/Edmonton', label: 'Эдмонтон — UTC−7' },
  { value: 'America/Winnipeg', label: 'Виннипег — UTC−6' },
  { value: 'America/Mexico_City', label: 'Мехико — UTC−6' },
  { value: 'America/Chicago', label: 'Чикаго — UTC−6' },
  { value: 'America/Bogota', label: 'Богота — UTC−5' },
  { value: 'America/Detroit', label: 'Детройт — UTC−5' },
  { value: 'America/Cancun', label: 'Канкун — UTC−5' },
  { value: 'America/New_York', label: 'Нью-Йорк — UTC−5' },
  { value: 'America/Toronto', label: 'Торонто — UTC−5' },
  { value: 'America/Halifax', label: 'Галифакс — UTC−4' },
  { value: 'America/Manaus', label: 'Манаус — UTC−4' },
  { value: 'America/Santiago', label: 'Сантьяго — UTC−4' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Буэнос-Айрес — UTC−3' },
  { value: 'America/Recife', label: 'Ресифи — UTC−3' },
  { value: 'America/Bahia', label: 'Салвадор — UTC−3' },
  { value: 'America/Sao_Paulo', label: 'Сан-Паулу — UTC−3' },
  { value: 'America/Fortaleza', label: 'Форталеза — UTC−3' },
  { value: 'Europe/Dublin', label: 'Дублин — UTC+0' },
  { value: 'Europe/Lisbon', label: 'Лиссабон — UTC+0' },
  { value: 'Europe/London', label: 'Лондон — UTC+0' },
  { value: 'Europe/Amsterdam', label: 'Амстердам — UTC+1' },
  { value: 'Europe/Berlin', label: 'Берлин — UTC+1' },
  { value: 'Europe/Bratislava', label: 'Братислава — UTC+1' },
  { value: 'Europe/Brussels', label: 'Брюссель — UTC+1' },
  { value: 'Europe/Budapest', label: 'Будапешт — UTC+1' },
  { value: 'Europe/Warsaw', label: 'Варшава — UTC+1' },
  { value: 'Europe/Vienna', label: 'Вена — UTC+1' },
  { value: 'Europe/Copenhagen', label: 'Копенгаген — UTC+1' },
  { value: 'Africa/Lagos', label: 'Лагос — UTC+1' },
  { value: 'Europe/Madrid', label: 'Мадрид — UTC+1' },
  { value: 'Europe/Oslo', label: 'Осло — UTC+1' },
  { value: 'Europe/Paris', label: 'Париж — UTC+1' },
  { value: 'Europe/Prague', label: 'Прага — UTC+1' },
  { value: 'Europe/Rome', label: 'Рим — UTC+1' },
  { value: 'Europe/Stockholm', label: 'Стокгольм — UTC+1' },
  { value: 'Europe/Zurich', label: 'Цюрих — UTC+1' },
  { value: 'Europe/Athens', label: 'Афины — UTC+2' },
  { value: 'Europe/Bucharest', label: 'Бухарест — UTC+2' },
  { value: 'Europe/Vilnius', label: 'Вильнюс — UTC+2' },
  { value: 'Asia/Jerusalem', label: 'Иерусалим — UTC+2' },
  { value: 'Africa/Johannesburg', label: 'Йоханнесбург — UTC+2' },
  { value: 'Africa/Cairo', label: 'Каир — UTC+2' },
  { value: 'Europe/Kaliningrad', label: 'Калининград — UTC+2' },
  { value: 'Europe/Kyiv', label: 'Киев — UTC+2' },
  { value: 'Europe/Chisinau', label: 'Кишинёв — UTC+2' },
  { value: 'Europe/Riga', label: 'Рига — UTC+2' },
  { value: 'Europe/Sofia', label: 'София — UTC+2' },
  { value: 'Europe/Tallinn', label: 'Таллин — UTC+2' },
  { value: 'Europe/Helsinki', label: 'Хельсинки — UTC+2' },
  { value: 'Europe/Minsk', label: 'Минск — UTC+3' },
  { value: 'Europe/Moscow', label: 'Москва — UTC+3' },
  { value: 'Europe/Istanbul', label: 'Стамбул — UTC+3' },
  { value: 'Asia/Baku', label: 'Баку — UTC+4' },
  { value: 'Asia/Dubai', label: 'Дубай — UTC+4' },
  { value: 'Asia/Yerevan', label: 'Ереван — UTC+4' },
  { value: 'Europe/Samara', label: 'Самара — UTC+4' },
  { value: 'Asia/Tbilisi', label: 'Тбилиси — UTC+4' },
  { value: 'Asia/Aqtobe', label: 'Актобе — UTC+5' },
  { value: 'Asia/Atyrau', label: 'Атырау — UTC+5' },
  { value: 'Asia/Yekaterinburg', label: 'Екатеринбург — UTC+5' },
  { value: 'Asia/Kolkata', label: 'Мумбаи — UTC+5.5' },
  { value: 'Asia/Almaty', label: 'Алматы — UTC+6' },
  { value: 'Asia/Omsk', label: 'Омск — UTC+6' },
  { value: 'Asia/Bangkok', label: 'Бангкок — UTC+7' },
  { value: 'Asia/Jakarta', label: 'Джакарта — UTC+7' },
  { value: 'Asia/Krasnoyarsk', label: 'Красноярск — UTC+7' },
  { value: 'Asia/Novosibirsk', label: 'Новосибирск — UTC+7' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Хошимин — UTC+7' },
  { value: 'Asia/Makassar', label: 'Бали — UTC+8' },
  { value: 'Asia/Hong_Kong', label: 'Гонконг — UTC+8' },
  { value: 'Asia/Irkutsk', label: 'Иркутск — UTC+8' },
  { value: 'Asia/Manila', label: 'Манила — UTC+8' },
  { value: 'Australia/Perth', label: 'Перт — UTC+8' },
  { value: 'Asia/Singapore', label: 'Сингапур — UTC+8' },
  { value: 'Asia/Seoul', label: 'Сеул — UTC+9' },
  { value: 'Asia/Tokyo', label: 'Токио — UTC+9' },
  { value: 'Australia/Adelaide', label: 'Аделаида — UTC+9.5' },
  { value: 'Australia/Darwin', label: 'Дарвин — UTC+9.5' },
  { value: 'Australia/Brisbane', label: 'Брисбен — UTC+10' },
  { value: 'Asia/Vladivostok', label: 'Владивосток — UTC+10' },
  { value: 'Australia/Melbourne', label: 'Мельбурн — UTC+10' },
  { value: 'Australia/Sydney', label: 'Сидней — UTC+10' },
  { value: 'Australia/Hobart', label: 'Хобарт — UTC+10' },
  { value: 'Pacific/Auckland', label: 'Окленд — UTC+12' },
];

export const LOCALE_OPTIONS = [
  { value: AUTO, label: 'По стране прокси' },
  { value: 'az-AZ', label: 'Азербайджанский' },
  { value: 'en-AU', label: 'Английский — Австралия' },
  { value: 'en-GB', label: 'Английский — Великобритания' },
  { value: 'en-HK', label: 'Английский — Гонконг' },
  { value: 'en-IN', label: 'Английский — Индия' },
  { value: 'en-IE', label: 'Английский — Ирландия' },
  { value: 'en-CA', label: 'Английский — Канада' },
  { value: 'en-NG', label: 'Английский — Нигерия' },
  { value: 'en-NZ', label: 'Английский — Новая Зеландия' },
  { value: 'en-AE', label: 'Английский — ОАЭ' },
  { value: 'en-US', label: 'Английский — США' },
  { value: 'en-SG', label: 'Английский — Сингапур' },
  { value: 'en-PH', label: 'Английский — Филиппины' },
  { value: 'en-ZA', label: 'Английский — ЮАР' },
  { value: 'ar-EG', label: 'Арабский — Египет' },
  { value: 'hy-AM', label: 'Армянский' },
  { value: 'bg-BG', label: 'Болгарский' },
  { value: 'hu-HU', label: 'Венгерский' },
  { value: 'vi-VN', label: 'Вьетнамский' },
  { value: 'el-GR', label: 'Греческий' },
  { value: 'ka-GE', label: 'Грузинский' },
  { value: 'da-DK', label: 'Датский' },
  { value: 'he-IL', label: 'Иврит' },
  { value: 'id-ID', label: 'Индонезийский' },
  { value: 'es-AR', label: 'Испанский — Аргентина' },
  { value: 'es-ES', label: 'Испанский — Испания' },
  { value: 'es-CO', label: 'Испанский — Колумбия' },
  { value: 'es-MX', label: 'Испанский — Мексика' },
  { value: 'es-CL', label: 'Испанский — Чили' },
  { value: 'it-IT', label: 'Итальянский' },
  { value: 'ko-KR', label: 'Корейский' },
  { value: 'lv-LV', label: 'Латышский' },
  { value: 'lt-LT', label: 'Литовский' },
  { value: 'de-AT', label: 'Немецкий — Австрия' },
  { value: 'de-DE', label: 'Немецкий — Германия' },
  { value: 'de-CH', label: 'Немецкий — Швейцария' },
  { value: 'nl-NL', label: 'Нидерландский' },
  { value: 'nl-BE', label: 'Нидерландский — Бельгия' },
  { value: 'nb-NO', label: 'Норвежский' },
  { value: 'pl-PL', label: 'Польский' },
  { value: 'pt-BR', label: 'Португальский — Бразилия' },
  { value: 'pt-PT', label: 'Португальский — Португалия' },
  { value: 'ro-RO', label: 'Румынский' },
  { value: 'ro-MD', label: 'Румынский — Молдова' },
  { value: 'ru-BY', label: 'Русский — Беларусь' },
  { value: 'ru-KZ', label: 'Русский — Казахстан' },
  { value: 'ru-RU', label: 'Русский — Россия' },
  { value: 'sk-SK', label: 'Словацкий' },
  { value: 'th-TH', label: 'Тайский' },
  { value: 'tr-TR', label: 'Турецкий' },
  { value: 'uk-UA', label: 'Украинский' },
  { value: 'fi-FI', label: 'Финский' },
  { value: 'fr-FR', label: 'Французский' },
  { value: 'cs-CZ', label: 'Чешский' },
  { value: 'sv-SE', label: 'Шведский' },
  { value: 'et-EE', label: 'Эстонский' },
  { value: 'ja-JP', label: 'Японский' },
];

export const CORES_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '4', label: '4 ядра' },
  { value: '6', label: '6 ядер' },
  { value: '8', label: '8 ядер' },
  { value: '10', label: '10 ядер' },
  { value: '11', label: '11 ядер' },
  { value: '12', label: '12 ядер' },
  { value: '14', label: '14 ядер' },
  { value: '16', label: '16 ядер' },
  { value: '24', label: '24 ядра' },
  { value: '32', label: '32 ядра' },
];

export const MEMORY_OPTIONS = [
  { value: AUTO, label: 'Автоматически' },
  { value: '8', label: '8 ГБ' },
  { value: '16', label: '16 ГБ' },
  { value: '18', label: '18 ГБ' },
  { value: '24', label: '24 ГБ' },
  { value: '32', label: '32 ГБ' },
  { value: '36', label: '36 ГБ' },
  { value: '48', label: '48 ГБ' },
  { value: '64', label: '64 ГБ' },
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
  CA: { timezone: 'America/Toronto', locale: 'en-CA' },
  GB: { timezone: 'Europe/London', locale: 'en-GB' },
  IE: { timezone: 'Europe/Dublin', locale: 'en-IE' },
  DE: { timezone: 'Europe/Berlin', locale: 'de-DE' },
  AT: { timezone: 'Europe/Vienna', locale: 'de-AT' },
  CH: { timezone: 'Europe/Zurich', locale: 'de-CH' },
  FR: { timezone: 'Europe/Paris', locale: 'fr-FR' },
  NL: { timezone: 'Europe/Amsterdam', locale: 'nl-NL' },
  BE: { timezone: 'Europe/Brussels', locale: 'nl-BE' },
  PL: { timezone: 'Europe/Warsaw', locale: 'pl-PL' },
  ES: { timezone: 'Europe/Madrid', locale: 'es-ES' },
  PT: { timezone: 'Europe/Lisbon', locale: 'pt-PT' },
  IT: { timezone: 'Europe/Rome', locale: 'it-IT' },
  SE: { timezone: 'Europe/Stockholm', locale: 'sv-SE' },
  NO: { timezone: 'Europe/Oslo', locale: 'nb-NO' },
  DK: { timezone: 'Europe/Copenhagen', locale: 'da-DK' },
  FI: { timezone: 'Europe/Helsinki', locale: 'fi-FI' },
  CZ: { timezone: 'Europe/Prague', locale: 'cs-CZ' },
  SK: { timezone: 'Europe/Bratislava', locale: 'sk-SK' },
  HU: { timezone: 'Europe/Budapest', locale: 'hu-HU' },
  RO: { timezone: 'Europe/Bucharest', locale: 'ro-RO' },
  BG: { timezone: 'Europe/Sofia', locale: 'bg-BG' },
  GR: { timezone: 'Europe/Athens', locale: 'el-GR' },
  UA: { timezone: 'Europe/Kyiv', locale: 'uk-UA' },
  MD: { timezone: 'Europe/Chisinau', locale: 'ro-MD' },
  LT: { timezone: 'Europe/Vilnius', locale: 'lt-LT' },
  LV: { timezone: 'Europe/Riga', locale: 'lv-LV' },
  EE: { timezone: 'Europe/Tallinn', locale: 'et-EE' },
  RU: { timezone: 'Europe/Moscow', locale: 'ru-RU' },
  BY: { timezone: 'Europe/Minsk', locale: 'ru-BY' },
  KZ: { timezone: 'Asia/Almaty', locale: 'ru-KZ' },
  GE: { timezone: 'Asia/Tbilisi', locale: 'ka-GE' },
  AM: { timezone: 'Asia/Yerevan', locale: 'hy-AM' },
  AZ: { timezone: 'Asia/Baku', locale: 'az-AZ' },
  TR: { timezone: 'Europe/Istanbul', locale: 'tr-TR' },
  IL: { timezone: 'Asia/Jerusalem', locale: 'he-IL' },
  AE: { timezone: 'Asia/Dubai', locale: 'en-AE' },
  IN: { timezone: 'Asia/Kolkata', locale: 'en-IN' },
  SG: { timezone: 'Asia/Singapore', locale: 'en-SG' },
  HK: { timezone: 'Asia/Hong_Kong', locale: 'en-HK' },
  JP: { timezone: 'Asia/Tokyo', locale: 'ja-JP' },
  KR: { timezone: 'Asia/Seoul', locale: 'ko-KR' },
  VN: { timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN' },
  TH: { timezone: 'Asia/Bangkok', locale: 'th-TH' },
  ID: { timezone: 'Asia/Jakarta', locale: 'id-ID' },
  PH: { timezone: 'Asia/Manila', locale: 'en-PH' },
  BR: { timezone: 'America/Sao_Paulo', locale: 'pt-BR' },
  MX: { timezone: 'America/Mexico_City', locale: 'es-MX' },
  AR: { timezone: 'America/Argentina/Buenos_Aires', locale: 'es-AR' },
  CL: { timezone: 'America/Santiago', locale: 'es-CL' },
  CO: { timezone: 'America/Bogota', locale: 'es-CO' },
  ZA: { timezone: 'Africa/Johannesburg', locale: 'en-ZA' },
  EG: { timezone: 'Africa/Cairo', locale: 'ar-EG' },
  NG: { timezone: 'Africa/Lagos', locale: 'en-NG' },
  AU: { timezone: 'Australia/Sydney', locale: 'en-AU' },
  NZ: { timezone: 'Pacific/Auckland', locale: 'en-NZ' },
};

const CITY_TZ: Record<string, Record<string, string>> = {
  US: {
    'new york': 'America/New_York', brooklyn: 'America/New_York', queens: 'America/New_York',
    boston: 'America/New_York', philadelphia: 'America/New_York', atlanta: 'America/New_York',
    miami: 'America/New_York', washington: 'America/New_York', newark: 'America/New_York',
    charlotte: 'America/New_York', detroit: 'America/Detroit', columbus: 'America/New_York',
    chicago: 'America/Chicago', houston: 'America/Chicago', dallas: 'America/Chicago',
    austin: 'America/Chicago', 'san antonio': 'America/Chicago', minneapolis: 'America/Chicago',
    'kansas city': 'America/Chicago', 'new orleans': 'America/Chicago', memphis: 'America/Chicago',
    denver: 'America/Denver', 'salt lake city': 'America/Denver', albuquerque: 'America/Denver',
    phoenix: 'America/Phoenix', tucson: 'America/Phoenix',
    'los angeles': 'America/Los_Angeles', 'san francisco': 'America/Los_Angeles',
    'san diego': 'America/Los_Angeles', seattle: 'America/Los_Angeles',
    portland: 'America/Los_Angeles', 'san jose': 'America/Los_Angeles',
    sacramento: 'America/Los_Angeles', 'las vegas': 'America/Los_Angeles',
    anchorage: 'America/Anchorage', honolulu: 'Pacific/Honolulu',
  },
  RU: {
    moscow: 'Europe/Moscow', 'saint petersburg': 'Europe/Moscow', kazan: 'Europe/Moscow',
    'nizhny novgorod': 'Europe/Moscow', rostov: 'Europe/Moscow', voronezh: 'Europe/Moscow',
    krasnodar: 'Europe/Moscow', sochi: 'Europe/Moscow', samara: 'Europe/Samara',
    yekaterinburg: 'Asia/Yekaterinburg', perm: 'Asia/Yekaterinburg', chelyabinsk: 'Asia/Yekaterinburg',
    ufa: 'Asia/Yekaterinburg', omsk: 'Asia/Omsk', novosibirsk: 'Asia/Novosibirsk',
    krasnoyarsk: 'Asia/Krasnoyarsk', irkutsk: 'Asia/Irkutsk', vladivostok: 'Asia/Vladivostok',
    khabarovsk: 'Asia/Vladivostok', kaliningrad: 'Europe/Kaliningrad',
  },
  CA: {
    toronto: 'America/Toronto', ottawa: 'America/Toronto', montreal: 'America/Toronto',
    quebec: 'America/Toronto', winnipeg: 'America/Winnipeg', calgary: 'America/Edmonton',
    edmonton: 'America/Edmonton', vancouver: 'America/Vancouver', victoria: 'America/Vancouver',
    halifax: 'America/Halifax',
  },
  BR: {
    'sao paulo': 'America/Sao_Paulo', 'rio de janeiro': 'America/Sao_Paulo',
    brasilia: 'America/Sao_Paulo', salvador: 'America/Bahia', fortaleza: 'America/Fortaleza',
    manaus: 'America/Manaus', recife: 'America/Recife',
  },
  AU: {
    sydney: 'Australia/Sydney', melbourne: 'Australia/Melbourne', canberra: 'Australia/Sydney',
    brisbane: 'Australia/Brisbane', adelaide: 'Australia/Adelaide', perth: 'Australia/Perth',
    hobart: 'Australia/Hobart', darwin: 'Australia/Darwin',
  },
  KZ: { almaty: 'Asia/Almaty', astana: 'Asia/Almaty', aktobe: 'Asia/Aqtobe', atyrau: 'Asia/Atyrau' },
  ID: { jakarta: 'Asia/Jakarta', surabaya: 'Asia/Jakarta', bali: 'Asia/Makassar', denpasar: 'Asia/Makassar' },
  MX: { 'mexico city': 'America/Mexico_City', guadalajara: 'America/Mexico_City', tijuana: 'America/Tijuana', cancun: 'America/Cancun' },
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

  let timezone = base?.timezone;

  /* Город даёт точный пояс: Лос-Анджелес и Нью-Йорк — это разное время */
  const cities = CITY_TZ[code];
  const cityKey = (geo.city || '').toLowerCase().trim();
  if (cities && cityKey && cities[cityKey]) {
    timezone = cities[cityKey];
  } else if (geo.timezone && geo.timezone.includes('/')) {
    /* Иначе берём пояс, который вернул сервис определения IP */
    timezone = geo.timezone;
  }

  return { timezone, locale: base?.locale };
};

export const tzLabel = (value?: string) =>
  TIMEZONE_OPTIONS.find((o) => o.value === value)?.label.split(' — ')[0] || value || '';

export const localeLabel = (value?: string) =>
  LOCALE_OPTIONS.find((o) => o.value === value)?.label || value || '';
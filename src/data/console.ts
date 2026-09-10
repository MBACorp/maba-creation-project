export type ProfileStatus = 'running' | 'ready' | 'paused';

import { FingerprintOverride } from './fingerprint';

export interface Profile {
  id: string;
  name: string;
  status: ProfileStatus;
  note: string;
  proxyType: string;
  country: string;
  flag: string;
  ip: string;
  tags: string[];
  lastRun: string;
  fingerprint?: FingerprintOverride;
}

export const STATUS_LABEL: Record<ProfileStatus, string> = {
  running: 'в работе',
  ready: 'готов',
  paused: 'пауза',
};

export const profilesSeed: Profile[] = [
  {
    id: 'p1',
    name: 'Denver card/america',
    status: 'running',
    note: 'карточный',
    proxyType: 'socks5',
    country: 'US',
    flag: '🇺🇸',
    ip: '46.17.43.24',
    tags: ['карты', 'US'],
    lastRun: '2 минуты назад',
  },
  {
    id: 'p2',
    name: 'Denver/card Dominos',
    status: 'ready',
    note: 'доставка',
    proxyType: 'socks5',
    country: 'US',
    flag: '🇺🇸',
    ip: '217.182.193.11',
    tags: ['доставка'],
    lastRun: 'вчера, 21:40',
  },
  {
    id: 'p3',
    name: 'Avito',
    status: 'ready',
    note: 'без прокси',
    proxyType: '—',
    country: '',
    flag: '',
    ip: '—',
    tags: ['объявления'],
    lastRun: '3 дня назад',
  },
  {
    id: 'p4',
    name: 'Shop DE / retail',
    status: 'ready',
    note: 'команда',
    proxyType: 'http',
    country: 'DE',
    flag: '🇩🇪',
    ip: '91.214.68.7',
    tags: ['ритейл', 'команда'],
    lastRun: 'вчера, 12:05',
  },
  {
    id: 'p5',
    name: 'Mail farm 02',
    status: 'paused',
    note: 'почта',
    proxyType: 'socks5',
    country: 'NL',
    flag: '🇳🇱',
    ip: '185.44.12.90',
    tags: ['почта'],
    lastRun: '5 дней назад',
  },
  {
    id: 'p6',
    name: 'Ads cabinet / PL',
    status: 'ready',
    note: 'реклама',
    proxyType: 'socks5',
    country: 'PL',
    flag: '🇵🇱',
    ip: '83.19.207.42',
    tags: ['реклама'],
    lastRun: 'сегодня, 09:12',
  },
];

export type SectionId = 'profiles' | 'proxy' | 'ai' | 'api' | 'android';

export interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
  meta?: string;
  tag?: string;
}

export const navItems: NavItem[] = [
  { id: 'profiles', label: 'Все профили', icon: 'LayoutGrid', meta: '6' },
  { id: 'proxy', label: 'Прокси', icon: 'Globe', meta: '2.0 ГБ' },
  { id: 'ai', label: 'AI Ассистент', icon: 'Sparkles' },
  { id: 'api', label: 'API & MCP', icon: 'Workflow' },
  { id: 'android', label: 'Cloud Android', icon: 'Smartphone', tag: 'Beta' },
];

export interface ProxyItem {
  id: string;
  host: string;
  type: string;
  country: string;
  flag: string;
  traffic: string;
  usedBy: number;
}

export const proxyList: ProxyItem[] = [
  { id: 'x1', host: '46.17.43.24:1080', type: 'socks5', country: 'США', flag: '🇺🇸', traffic: '740 МБ', usedBy: 1 },
  { id: 'x2', host: '217.182.193.11:1085', type: 'socks5', country: 'США', flag: '🇺🇸', traffic: '512 МБ', usedBy: 1 },
  { id: 'x3', host: '91.214.68.7:8080', type: 'http', country: 'Германия', flag: '🇩🇪', traffic: '318 МБ', usedBy: 1 },
  { id: 'x4', host: '185.44.12.90:1080', type: 'socks5', country: 'Нидерланды', flag: '🇳🇱', traffic: '204 МБ', usedBy: 1 },
  { id: 'x5', host: '83.19.207.42:1080', type: 'socks5', country: 'Польша', flag: '🇵🇱', traffic: '266 МБ', usedBy: 1 },
];
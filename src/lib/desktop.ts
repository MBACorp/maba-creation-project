import { Profile } from '@/data/console';

export interface Fingerprint {
  os: string;
  userAgent: string;
  platform: string;
  screen: { width: number; height: number };
  hardwareConcurrency: number;
  deviceMemory: number;
  gpu: { vendor: string; renderer: string };
  fonts: string[];
  locale: string;
  languages: string[];
  timezone: string;
}

export interface StartResult {
  ok: boolean;
  error?: string;
  alreadyRunning?: boolean;
  fingerprint?: Fingerprint;
  cookies?: number;
}

interface MbaBridge {
  isDesktop: boolean;
  platform: string;
  listProfiles: () => Promise<{ profiles: Profile[]; running: string[] }>;
  saveProfile: (profile: Profile) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<boolean>;
  startProfile: (profile: Profile) => Promise<StartResult>;
  stopProfile: (id: string) => Promise<{ ok: boolean }>;
  listCookies: (profileId: string) => Promise<{
    total: number;
    domains: { domain: string; count: number; expired: number; session: number }[];
  }>;
  importCookies: (payload: {
    profileId: string;
    text: string;
    replace: boolean;
  }) => Promise<{
    ok: boolean;
    error?: string;
    added?: number;
    total?: number;
    summary?: {
      total: number;
      domains: { domain: string; count: number; expired: number; session: number }[];
    };
  }>;
  exportCookies: (payload: {
    profileId: string;
    profileName: string;
    format: string;
  }) => Promise<{ ok: boolean; error?: string; canceled?: boolean; count?: number }>;
  clearCookies: (profileId: string) => Promise<{ ok: boolean }>;
  pickCookieFile: () => Promise<{
    ok: boolean;
    canceled?: boolean;
    text?: string;
    name?: string;
  }>;

  listProxies: () => Promise<unknown[]>;
  saveProxy: (proxy: unknown) => Promise<unknown>;
  deleteProxy: (id: string) => Promise<boolean>;
  appInfo: () => Promise<{ version: string; dataPath: string; platform: string }>;
  openDataFolder: () => Promise<string>;
  onProfileStarted: (cb: (id: string) => void) => void;
  onProfileStopped: (cb: (id: string) => void) => void;
}

declare global {
  interface Window {
    MBA?: MbaBridge;
  }
}

export const bridge = (): MbaBridge | null =>
  typeof window !== 'undefined' && window.MBA ? window.MBA : null;

export const isDesktop = () => Boolean(bridge());
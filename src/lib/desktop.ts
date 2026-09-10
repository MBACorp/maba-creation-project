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
}

interface MbaBridge {
  isDesktop: boolean;
  platform: string;
  listProfiles: () => Promise<{ profiles: Profile[]; running: string[] }>;
  saveProfile: (profile: Profile) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<boolean>;
  startProfile: (profile: Profile) => Promise<StartResult>;
  stopProfile: (id: string) => Promise<{ ok: boolean }>;
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

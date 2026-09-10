import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Profile, profilesSeed } from '@/data/console';
import { bridge, isDesktop } from '@/lib/desktop';

export const useProfiles = (limit: number) => {
  const [profiles, setProfiles] = useState<Profile[]>(profilesSeed);
  const [busy, setBusy] = useState<string | null>(null);
  const desktop = isDesktop();

  const reload = useCallback(async () => {
    const api = bridge();
    if (!api) return;
    const { profiles: saved, running } = await api.listProfiles();
    const list = saved.length ? saved : profilesSeed;
    setProfiles(
      list.map((p) => ({
        ...p,
        status: running.includes(p.id) ? 'running' : p.status === 'running' ? 'ready' : p.status,
      })),
    );
  }, []);

  useEffect(() => {
    const api = bridge();
    if (!api) return;
    reload();
    api.onProfileStarted((id) =>
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'running', lastRun: 'сейчас' } : p)),
      ),
    );
    api.onProfileStopped((id) =>
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'ready', lastRun: 'только что' } : p)),
      ),
    );
  }, [reload]);

  const toggleProfile = useCallback(
    async (id: string) => {
      const profile = profiles.find((p) => p.id === id);
      if (!profile) return;
      const api = bridge();

      if (!api) {
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: p.status === 'running' ? 'ready' : 'running',
                  lastRun: p.status === 'running' ? 'только что' : 'сейчас',
                }
              : p,
          ),
        );
        toast(
          profile.status === 'running'
            ? `Профиль «${profile.name}» остановлен`
            : `Профиль «${profile.name}» запущен`,
          { description: 'Демо-режим в браузере. В приложении откроется настоящее окно.' },
        );
        return;
      }

      setBusy(id);
      try {
        if (profile.status === 'running') {
          await api.stopProfile(id);
          toast(`Профиль «${profile.name}» остановлен`);
        } else {
          const result = await api.startProfile(profile);
          if (!result.ok) {
            toast.error('Не удалось запустить профиль', { description: result.error });
            return;
          }
          const fp = result.fingerprint;
          toast(`Профиль «${profile.name}» запущен`, {
            description: fp
              ? `${fp.os === 'mac' ? 'macOS' : 'Windows'} · ${fp.screen.width}×${fp.screen.height} · ${fp.timezone}`
              : undefined,
          });
        }
      } finally {
        setBusy(null);
      }
    },
    [profiles],
  );

  const createProfile = useCallback(
    async (data: Omit<Profile, 'id'>) => {
      if (profiles.length >= limit) {
        toast('Достигнут лимит тарифа Professional');
        return;
      }
      const profile: Profile = { ...data, id: `p${Date.now()}` };
      setProfiles((prev) => [...prev, profile]);
      const api = bridge();
      if (api) await api.saveProfile(profile);
      toast(`Профиль «${data.name}» создан`);
    },
    [profiles.length, limit],
  );

  const deleteProfile = useCallback(async (id: string) => {
    const api = bridge();
    if (api) await api.deleteProfile(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    toast('Профиль удалён');
  }, []);

  return { profiles, busy, desktop, toggleProfile, createProfile, deleteProfile, reload };
};

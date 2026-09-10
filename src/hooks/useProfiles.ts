import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Profile, profilesSeed } from '@/data/console';
import {
  FingerprintOverride,
  countOverrides,
  geoToFingerprint,
  localeLabel,
  tzLabel,
} from '@/data/fingerprint';
import { flagOf } from '@/data/proxy';
import { bridge, isDesktop } from '@/lib/desktop';

interface ProxyLike {
  id: string;
  host: string;
  port: number;
  type: string;
  user?: string;
  password?: string;
  country?: string;
  city?: string;
  ip?: string;
  timezone?: string;
  status?: string;
}

export const useProfiles = (limit: number, proxies: ProxyLike[] = []) => {
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
          const proxy = proxies.find((x) => x.id === profile.proxyId);
          const result = await api.startProfile({
            ...profile,
            proxyHost: proxy ? `${proxy.host}:${proxy.port}` : undefined,
            proxyUser: proxy?.user,
            proxyPass: proxy?.password,
            proxyType: proxy?.type || profile.proxyType,
          } as Profile);
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
    [profiles, proxies],
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

  const setFingerprint = useCallback(
    async (id: string, fp: FingerprintOverride) => {
      let updated: Profile | undefined;
      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, fingerprint: fp };
          return updated;
        }),
      );
      const api = bridge();
      if (api && updated) await api.saveProfile(updated);

      const count = countOverrides(fp);
      toast(count ? 'Отпечаток сохранён' : 'Отпечаток сброшен на автоматический', {
        description: count
          ? `${count} значений задано вручную. Применится при следующем запуске.`
          : 'Значения снова подбираются автоматически.',
      });
    },
    [],
  );

  const setProxy = useCallback(
    async (
      id: string,
      proxy?: {
        id: string;
        type: string;
        country?: string;
        city?: string;
        ip?: string;
        timezone?: string;
      },
    ) => {
      let updated: Profile | undefined;
      const geo = proxy ? geoToFingerprint(proxy) : {};

      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          updated = proxy
            ? {
                ...p,
                proxyId: proxy.id,
                proxyType: proxy.type,
                country: proxy.country || '',
                flag: proxy.country ? flagOf(proxy.country) : '',
                ip: proxy.ip || '—',
                fingerprint:
                  geo.timezone || geo.locale
                    ? {
                        ...p.fingerprint,
                        ...(geo.timezone ? { timezone: geo.timezone } : {}),
                        ...(geo.locale ? { locale: geo.locale } : {}),
                        geoAuto: true,
                      }
                    : p.fingerprint,
              }
            : {
                ...p,
                proxyId: undefined,
                proxyType: '—',
                country: '',
                flag: '',
                ip: '—',
                fingerprint: p.fingerprint?.geoAuto
                  ? {
                      ...p.fingerprint,
                      timezone: undefined,
                      locale: undefined,
                      geoAuto: undefined,
                    }
                  : p.fingerprint,
              };
          return updated;
        }),
      );

      const api = bridge();
      if (api && updated) await api.saveProfile(updated);

      if (proxy) {
        toast('Прокси привязан к профилю', {
          description:
            geo.timezone || geo.locale
              ? `Часовой пояс и язык подстроены: ${[tzLabel(geo.timezone), localeLabel(geo.locale)]
                  .filter(Boolean)
                  .join(' · ')}`
              : 'Проверьте прокси, чтобы подобрать часовой пояс и язык',
        });
      } else {
        toast('Прокси отвязан');
      }
    },
    [],
  );

  const syncGeo = useCallback(
    async (checked: ProxyLike[]) => {
      const byId = new Map(checked.map((p) => [p.id, p]));
      const touched: Profile[] = [];

      setProfiles((prev) =>
        prev.map((p) => {
          if (!p.proxyId || !byId.has(p.proxyId)) return p;
          const proxy = byId.get(p.proxyId)!;
          if (proxy.status !== 'ok') return p;

          const geo = geoToFingerprint(proxy);
          if (!geo.timezone && !geo.locale) return p;

          const manualGeo =
            p.fingerprint &&
            !p.fingerprint.geoAuto &&
            (p.fingerprint.timezone || p.fingerprint.locale);
          if (manualGeo) return p;

          if (
            p.fingerprint?.timezone === geo.timezone &&
            p.fingerprint?.locale === geo.locale
          ) {
            return p;
          }

          const next: Profile = {
            ...p,
            country: proxy.country || p.country,
            flag: proxy.country ? flagOf(proxy.country) : p.flag,
            ip: proxy.ip || p.ip,
            fingerprint: {
              ...p.fingerprint,
              ...(geo.timezone ? { timezone: geo.timezone } : {}),
              ...(geo.locale ? { locale: geo.locale } : {}),
              geoAuto: true,
            },
          };
          touched.push(next);
          return next;
        }),
      );

      if (!touched.length) return;

      const api = bridge();
      if (api) await Promise.all(touched.map((p) => api.saveProfile(p)));

      toast(
        touched.length === 1
          ? `Профиль «${touched[0].name}» подстроен под прокси`
          : `Подстроено профилей: ${touched.length}`,
        {
          description: `Часовой пояс и язык обновлены по стране прокси`,
        },
      );
    },
    [],
  );

  const moveToFolder = useCallback(
    async (ids: string[], folderId?: string, folderName?: string) => {
      const set = new Set(ids);
      const touched: Profile[] = [];

      setProfiles((prev) =>
        prev.map((p) => {
          if (!set.has(p.id) || p.folderId === folderId) return p;
          const next = { ...p, folderId };
          touched.push(next);
          return next;
        }),
      );

      if (!touched.length) return;

      const api = bridge();
      if (api) await Promise.all(touched.map((p) => api.saveProfile(p)));

      const target = folderId ? `в «${folderName}»` : 'из папки';
      toast(
        touched.length === 1
          ? `Профиль «${touched[0].name}» перемещён ${target}`
          : `Перемещено профилей: ${touched.length}`,
      );
    },
    [],
  );

  const setTags = useCallback(async (id: string, tags: string[]) => {
    let updated: Profile | undefined;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        updated = { ...p, tags };
        return updated;
      }),
    );
    const api = bridge();
    if (api && updated) await api.saveProfile(updated);
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    const api = bridge();
    if (api) await api.deleteProfile(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    toast('Профиль удалён');
  }, []);

  return {
    profiles,
    busy,
    desktop,
    toggleProfile,
    createProfile,
    deleteProfile,
    setFingerprint,
    setProxy,
    syncGeo,
    moveToFolder,
    setTags,
    reload,
  };
};
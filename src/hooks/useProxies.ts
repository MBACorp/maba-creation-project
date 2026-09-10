import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  ProxyRecord,
  checkProxies,
  parseProxyList,
  proxySeed,
} from '@/data/proxy';
import { bridge } from '@/lib/desktop';

const newId = () => `px${Date.now()}${Math.floor(Math.random() * 1000)}`;

export const useProxies = (onChecked?: (list: ProxyRecord[]) => void) => {
  const [proxies, setProxies] = useState<ProxyRecord[]>(proxySeed);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const api = bridge();
    if (!api) return;
    api.listProxies().then((saved) => {
      const list = saved as ProxyRecord[];
      if (list && list.length) setProxies(list);
    });
  }, []);

  const persist = useCallback(async (list: ProxyRecord[]) => {
    const api = bridge();
    if (!api) return;
    await Promise.all(list.map((p) => api.saveProxy(p)));
  }, []);

  const runCheck = useCallback(
    async (targets: ProxyRecord[]) => {
      if (!targets.length) return;
      setChecking(true);
      const ids = new Set(targets.map((p) => p.id));
      setProxies((prev) =>
        prev.map((p) => (ids.has(p.id) ? { ...p, status: 'checking' } : p)),
      );

      try {
        const results = await checkProxies(targets);
        let okCount = 0;
        const updated: ProxyRecord[] = [];

        setProxies((prev) =>
          prev.map((p) => {
            const r = results.find((x) => x.id === p.id);
            if (!r) return p;
            if (r.ok) okCount += 1;
            const next: ProxyRecord = {
              ...p,
              status: r.ok ? 'ok' : 'fail',
              ip: r.ip,
              country: r.country,
              city: r.city,
              org: r.org,
              timezone: r.timezone,
              latency: r.latency,
              error: r.error,
              checkedAt: new Date().toISOString(),
            };
            updated.push(next);
            return next;
          }),
        );

        persist(updated);
        if (onChecked && updated.length) onChecked(updated);

        if (targets.length === 1) {
          const r = results[0];
          if (r?.ok) {
            toast('Прокси работает', {
              description: `${r.ip} · ${r.city || ''} ${r.country || ''} · ${r.latency} мс`.trim(),
            });
          } else {
            toast.error('Прокси недоступен', { description: r?.error });
          }
        } else {
          toast(`Проверено ${results.length}: рабочих ${okCount}`, {
            description: okCount < results.length ? `Не отвечают: ${results.length - okCount}` : undefined,
          });
        }
      } catch (error) {
        setProxies((prev) =>
          prev.map((p) => (ids.has(p.id) ? { ...p, status: 'unknown' } : p)),
        );
        toast.error('Не удалось проверить прокси', {
          description: error instanceof Error ? error.message : undefined,
        });
      } finally {
        setChecking(false);
      }
    },
    [persist, onChecked],
  );

  const addProxies = useCallback(
    async (text: string, autoCheck = true) => {
      const { valid, invalid } = parseProxyList(text);
      if (!valid.length) {
        toast.error('Не удалось разобрать ни одной строки', {
          description: 'Формат: адрес:порт или логин:пароль@адрес:порт',
        });
        return [];
      }

      const created: ProxyRecord[] = valid.map((p) => ({
        ...p,
        id: newId(),
        status: 'unknown',
      }));

      setProxies((prev) => [...prev, ...created]);
      persist(created);

      toast(`Добавлено прокси: ${created.length}`, {
        description: invalid.length ? `Пропущено строк: ${invalid.length}` : undefined,
      });

      if (autoCheck) await runCheck(created);
      return created;
    },
    [persist, runCheck],
  );

  const deleteProxy = useCallback(async (id: string) => {
    setProxies((prev) => prev.filter((p) => p.id !== id));
    const api = bridge();
    if (api) await api.deleteProxy(id);
    toast('Прокси удалён');
  }, []);

  const checkAll = useCallback(() => runCheck(proxies), [proxies, runCheck]);

  return { proxies, checking, addProxies, deleteProxy, runCheck, checkAll };
};
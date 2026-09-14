import { useCallback, useEffect, useState } from 'react';

export interface WarmupSet {
  id: string;
  name: string;
  sites: string;
}

const KEY = 'mba.warmup.sets';

/* Готовые наборы на первый запуск — пользователь правит под себя */
const DEFAULTS: WarmupSet[] = [
  {
    id: 'ru-common',
    name: 'Общий прогрев',
    sites: 'yandex.ru\nlenta.ru\nkinopoisk.ru\nozon.ru\nvc.ru',
  },
  {
    id: 'ru-shops',
    name: 'Магазины',
    sites: 'ozon.ru\nwildberries.ru\navito.ru\ndns-shop.ru\nmvideo.ru',
  },
];

const read = (): WarmupSet[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : DEFAULTS;
  } catch (e) {
    return DEFAULTS;
  }
};

/* Наборы сайтов для прогрева: хранятся в приложении, общие для всех профилей */
export const useWarmupSets = () => {
  const [sets, setSets] = useState<WarmupSet[]>([]);

  useEffect(() => {
    setSets(read());
  }, []);

  const persist = useCallback((list: WarmupSet[]) => {
    setSets(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  }, []);

  /* Сохранение под именем: одноимённый набор перезаписываем, а не плодим копии */
  const saveSet = useCallback(
    (name: string, sites: string) => {
      const clean = name.trim();
      if (!clean) return;

      const list = read();
      const same = list.find((s) => s.name.toLowerCase() === clean.toLowerCase());

      const next = same
        ? list.map((s) => (s.id === same.id ? { ...s, sites } : s))
        : [...list, { id: `set-${Date.now()}`, name: clean, sites }];

      persist(next);
      return same ? 'updated' : 'created';
    },
    [persist],
  );

  const deleteSet = useCallback(
    (id: string) => {
      persist(read().filter((s) => s.id !== id));
    },
    [persist],
  );

  return { sets, saveSet, deleteSet };
};

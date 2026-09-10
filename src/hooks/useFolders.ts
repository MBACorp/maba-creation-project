import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Folder, FOLDER_COLORS, foldersSeed } from '@/data/folders';

const STORAGE_KEY = 'mba.folders';

const load = (): Folder[] => {
  if (typeof window === 'undefined') return foldersSeed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return foldersSeed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : foldersSeed;
  } catch {
    return foldersSeed;
  }
};

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>(foldersSeed);

  useEffect(() => setFolders(load()), []);

  const persist = useCallback((list: Folder[]) => {
    setFolders(list);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* хранилище недоступно */
    }
  }, []);

  const createFolder = useCallback(
    (name: string, color?: string) => {
      const clean = name.trim().slice(0, 32);
      if (!clean) {
        toast.error('Введите название папки');
        return null;
      }
      if (folders.some((f) => f.name.toLowerCase() === clean.toLowerCase())) {
        toast.error('Папка с таким названием уже есть');
        return null;
      }
      const folder: Folder = {
        id: `f${Date.now()}`,
        name: clean,
        color: color || FOLDER_COLORS[folders.length % FOLDER_COLORS.length].id,
        createdAt: new Date().toISOString(),
      };
      persist([...folders, folder]);
      toast(`Папка «${clean}» создана`);
      return folder;
    },
    [folders, persist],
  );

  const renameFolder = useCallback(
    (id: string, name: string) => {
      const clean = name.trim().slice(0, 32);
      if (!clean) return;
      persist(folders.map((f) => (f.id === id ? { ...f, name: clean } : f)));
    },
    [folders, persist],
  );

  const recolorFolder = useCallback(
    (id: string, color: string) => {
      persist(folders.map((f) => (f.id === id ? { ...f, color } : f)));
    },
    [folders, persist],
  );

  const deleteFolder = useCallback(
    (id: string) => {
      const folder = folders.find((f) => f.id === id);
      persist(folders.filter((f) => f.id !== id));
      if (folder) toast(`Папка «${folder.name}» удалена`, { description: 'Профили остались на месте' });
    },
    [folders, persist],
  );

  return { folders, createFolder, renameFolder, recolorFolder, deleteFolder };
};

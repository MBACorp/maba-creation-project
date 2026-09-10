export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt?: string;
}

export const FOLDER_COLORS = [
  { id: 'amber', label: 'Янтарный', class: 'bg-primary' },
  { id: 'violet', label: 'Фиолетовый', class: 'bg-ai' },
  { id: 'blue', label: 'Синий', class: 'bg-info' },
  { id: 'green', label: 'Зелёный', class: 'bg-emerald-500' },
  { id: 'rose', label: 'Розовый', class: 'bg-rose-500' },
  { id: 'slate', label: 'Серый', class: 'bg-dot' },
];

export const colorClass = (color?: string) =>
  FOLDER_COLORS.find((c) => c.id === color)?.class || 'bg-dot';

export const ALL_FOLDER = 'all';
export const NO_FOLDER = 'none';

export const foldersSeed: Folder[] = [
  { id: 'f1', name: 'Карточные', color: 'amber' },
  { id: 'f2', name: 'Реклама', color: 'violet' },
];

export const normalizeTag = (raw: string) =>
  raw
    .trim()
    .replace(/^#/, '')
    .replace(/\s+/g, ' ')
    .slice(0, 24);

export const parseTags = (raw: string) =>
  Array.from(
    new Set(
      raw
        .split(/[,\n;]+/)
        .map(normalizeTag)
        .filter(Boolean),
    ),
  );

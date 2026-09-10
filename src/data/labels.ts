export interface StatusLabel {
  id: string;
  name: string;
  dot: string;
  chip: string;
  icon: string;
}

/*
 * Метка — это ваша пометка о состоянии аккаунта, а не состояние запуска.
 * Профиль может быть запущен и при этом помечен как «на проверке».
 */
export const STATUS_LABELS: StatusLabel[] = [
  {
    id: 'active',
    name: 'В работе',
    dot: 'bg-emerald-500',
    chip: 'border-emerald-500/40 text-emerald-400',
    icon: 'Play',
  },
  {
    id: 'warmup',
    name: 'Прогрев',
    dot: 'bg-primary',
    chip: 'border-primary/45 text-primary',
    icon: 'Flame',
  },
  {
    id: 'paused',
    name: 'На паузе',
    dot: 'bg-dot',
    chip: 'border-border text-muted-foreground',
    icon: 'Pause',
  },
  {
    id: 'check',
    name: 'На проверке',
    dot: 'bg-info',
    chip: 'border-info/45 text-info',
    icon: 'ShieldQuestion',
  },
  {
    id: 'limited',
    name: 'Ограничен',
    dot: 'bg-amber-500',
    chip: 'border-amber-500/45 text-amber-400',
    icon: 'TriangleAlert',
  },
  {
    id: 'banned',
    name: 'Забанен',
    dot: 'bg-destructive',
    chip: 'border-destructive/45 text-destructive',
    icon: 'Ban',
  },
  {
    id: 'archive',
    name: 'Архив',
    dot: 'bg-ai',
    chip: 'border-ai/45 text-ai',
    icon: 'Archive',
  },
];

export const labelById = (id?: string) => STATUS_LABELS.find((l) => l.id === id);

export interface ProfileNote {
  id: string;
  text: string;
  createdAt: string;
  labelId?: string;
}

export const formatNoteDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  if (sameDay) return `сегодня, ${time}`;
  if (isYesterday) return `вчера, ${time}`;

  return `${date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })}, ${time}`;
};

export const newNote = (text: string, labelId?: string): ProfileNote => ({
  id: `n${Date.now()}${Math.floor(Math.random() * 100)}`,
  text: text.trim(),
  createdAt: new Date().toISOString(),
  labelId,
});

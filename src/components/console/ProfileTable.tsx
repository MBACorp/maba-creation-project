import Icon from '@/components/ui/icon';
import { Profile, STATUS_LABEL } from '@/data/console';
import { cn } from '@/lib/utils';

interface ProfileTableProps {
  profiles: Profile[];
  total: number;
  runningCount: number;
  busyId?: string | null;
  folderName?: string;
  activeTag?: string;
  onToggle: (id: string) => void;
  onOpen: (p: Profile) => void;
  onReset: () => void;
  onTagClick?: (tag: string) => void;
}

const ProfileTable = ({
  profiles,
  total,
  runningCount,
  busyId,
  folderName,
  activeTag,
  onToggle,
  onOpen,
  onReset,
  onTagClick,
}: ProfileTableProps) => {
  const startDrag = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('application/mba-profiles', JSON.stringify([id]));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="min-w-[900px] px-5 md:px-8">
      <div className="grid animate-fade-up grid-cols-[1fr_104px_128px_136px_180px_96px] items-center gap-4 border-b border-border px-1 py-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground [animation-delay:40ms]">
        <div>Имя</div>
        <div>Состояние</div>
        <div>Заметки</div>
        <div>Тип прокси</div>
        <div>Прокси и место</div>
        <div />
      </div>

      {profiles.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Icon name="SearchX" size={26} className="text-dot" />
          <p className="text-[14px] text-muted-foreground">Профили не найдены</p>
          <button
            onClick={onReset}
            className="rounded-lg border border-primary/45 px-3 py-1.5 text-[13px] text-primary transition-colors hover:bg-primary/10"
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {profiles.map((p, i) => {
        const running = p.status === 'running';
        return (
          <div
            key={p.id}
            draggable
            onDragStart={(e) => startDrag(e, p.id)}
            style={{ animationDelay: `${80 + i * 40}ms` }}
            className="group grid animate-fade-up grid-cols-[1fr_104px_128px_136px_180px_96px] items-center gap-4 border-b border-line-soft px-1 transition-colors hover:bg-card/70"
          >
            <div className="flex h-[62px] min-w-0 items-center gap-2">
              <Icon
                name="GripVertical"
                size={13}
                className="shrink-0 cursor-grab text-dot opacity-0 transition-opacity group-hover:opacity-100"
              />
              <button
                onClick={() => onOpen(p)}
                className="flex min-w-0 items-center gap-2 text-left font-head text-[15px] font-bold tracking-[-0.02em] text-foreground"
              >
                <span className="truncate">{p.name}</span>
                <Icon
                  name="ArrowUpRight"
                  size={14}
                  className="shrink-0 text-dot opacity-0 transition-opacity group-hover:opacity-100"
                />
              </button>
              {p.tags.slice(0, 2).map((t) => (
                <button
                  key={t}
                  onClick={() => onTagClick?.(t)}
                  className={cn(
                    'shrink-0 rounded border px-1.5 py-px text-[10px] transition-colors',
                    activeTag === t
                      ? 'border-primary/50 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <span
                className={cn(
                  'h-[7px] w-[7px] shrink-0 rounded-full',
                  running ? 'bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.18)]' : 'bg-dot',
                )}
              />
              {STATUS_LABEL[p.status]}
            </div>

            <div className="truncate text-[13px] text-muted-foreground">{p.note}</div>

            <div className="tabular text-[13px] text-muted-foreground">
              {p.proxyType === '—' ? '—' : `${p.proxyType} · ${p.country}`}
            </div>

            <div className="tabular flex items-center gap-2 text-[13px] text-muted-foreground">
              {p.flag && <span className="text-[14px] leading-none">{p.flag}</span>}
              <span className={running ? 'font-medium text-foreground' : undefined}>{p.ip}</span>
            </div>

            <button
              onClick={() => onToggle(p.id)}
              disabled={busyId === p.id}
              className={cn(
                'flex w-[84px] items-center justify-center gap-1.5 rounded-md border py-1.5 text-center text-[13px] font-semibold transition-colors disabled:opacity-60',
                running
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-primary/55 text-primary hover:bg-primary/10',
              )}
            >
              {busyId === p.id && <Icon name="Loader" size={12} className="animate-spin" />}
              {busyId === p.id ? '' : running ? 'Стоп' : 'Старт'}
            </button>
          </div>
        );
      })}

      <div className="flex animate-fade-up items-center justify-between px-1 py-4 text-[12px] text-muted-foreground [animation-delay:320ms]">
        <span>
          {profiles.length !== total && `${profiles.length} из `}
          {total} профилей · {runningCount} запущен{runningCount === 1 ? '' : 'о'}
          {folderName && ` · ${folderName}`}
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <Icon name="GripVertical" size={12} />
          Перетащите профиль в папку слева
        </span>
      </div>
    </div>
  );
};

export default ProfileTable;
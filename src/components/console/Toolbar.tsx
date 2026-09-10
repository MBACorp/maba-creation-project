import Icon from '@/components/ui/icon';
import { STATUS_LABELS } from '@/data/labels';
import { cn } from '@/lib/utils';

export type FilterId = 'all' | 'ready' | 'running' | 'noproxy';

interface ToolbarProps {
  eyebrow: string;
  title: string;
  query: string;
  onQuery: (v: string) => void;
  filter: FilterId;
  onFilter: (f: FilterId) => void;
  onBurger: () => void;
  showFilters: boolean;
  tags?: string[];
  activeTag?: string;
  onTag?: (tag?: string) => void;
  labelCounts?: Record<string, number>;
  activeLabel?: string;
  onLabel?: (labelId?: string) => void;
}

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'ready', label: 'Готовы к запуску' },
  { id: 'running', label: 'В работе' },
  { id: 'noproxy', label: 'Без прокси' },
];

const Toolbar = ({
  eyebrow,
  title,
  query,
  onQuery,
  filter,
  onFilter,
  onBurger,
  showFilters,
  tags = [],
  activeTag,
  onTag,
  labelCounts = {},
  activeLabel,
  onLabel,
}: ToolbarProps) => {
  const usedLabels = STATUS_LABELS.filter((l) => labelCounts[l.id]);
  return (
    <header className="flex flex-col gap-4 border-b border-border px-5 pb-4 pt-5 md:px-8"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex animate-fade-up items-center gap-3">
        <button
          onClick={onBurger}
          className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          aria-label="Меню"
        >
          <Icon name="Menu" size={16} />
        </button>
        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </div>
          <h1 className="font-head text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-foreground md:text-[30px]">
            {title}
          </h1>
        </div>
      </div>

      {showFilters && (
        <div className="flex animate-fade-up flex-wrap items-center gap-2 pb-1 [animation-delay:40ms]">
          <label className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] text-muted-foreground focus-within:border-primary/50 sm:w-56">
            <Icon name="Search" size={15} />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Поиск по имени и IP"
              className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilter(f.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                filter === f.id
                  ? 'border-primary/45 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {filter === f.id && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              {f.label}
            </button>
          ))}
        </div>
      )}
      </div>

      {showFilters && usedLabels.length > 0 && (
        <div className="flex animate-fade-up flex-wrap items-center gap-1.5 [animation-delay:50ms]">
          {usedLabels.map((l) => (
            <button
              key={l.id}
              onClick={() => onLabel?.(activeLabel === l.id ? undefined : l.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-2 py-1 text-[12px] transition-colors',
                activeLabel === l.id
                  ? l.chip
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              <span className={cn('h-[6px] w-[6px] rounded-full', l.dot)} />
              {l.name}
              <span className="tabular-nums opacity-60">{labelCounts[l.id]}</span>
            </button>
          ))}
          {activeLabel && (
            <button
              onClick={() => onLabel?.(undefined)}
              className="ml-1 flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon name="X" size={11} />
              сбросить
            </button>
          )}
        </div>
      )}

      {showFilters && tags.length > 0 && (
        <div className="flex animate-fade-up flex-wrap items-center gap-1.5 [animation-delay:60ms]">
          <Icon name="Tag" size={12} className="mr-0.5 text-dot" />
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => onTag?.(activeTag === t ? undefined : t)}
              className={cn(
                'rounded-md border px-2 py-1 text-[12px] transition-colors',
                activeTag === t
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
          {activeTag && (
            <button
              onClick={() => onTag?.(undefined)}
              className="ml-1 flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon name="X" size={11} />
              сбросить
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Toolbar;
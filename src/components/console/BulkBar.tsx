import Icon from '@/components/ui/icon';

interface BulkBarProps {
  count: number;
  runningCount?: number;
  progress?: { done: number; total: number } | null;
  onStart: () => void;
  onStopAll: () => void;
  onClear: () => void;
}

/*
 * Панель массовых действий.
 * Показывается, когда отмечены профили или когда есть что остановить —
 * чтобы закрыть пачку окон, не выбирая их заново.
 */
const BulkBar = ({
  count,
  runningCount = 0,
  progress,
  onStart,
  onStopAll,
  onClear,
}: BulkBarProps) => {
  if (!count && !runningCount) return null;

  const busy = Boolean(progress);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur">
        {count > 0 ? (
          <span className="text-[13px] text-foreground">
            Выбрано: <span className="font-semibold">{count}</span>
          </span>
        ) : (
          <span className="text-[13px] text-muted-foreground">
            В работе: <span className="font-semibold text-foreground">{runningCount}</span>
          </span>
        )}

        <span className="h-4 w-px bg-border" />

        {count > 0 && (
          <button
            onClick={onStart}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Icon
              name={busy ? 'Loader' : 'Play'}
              fallback="Play"
              size={13}
              className={busy ? 'animate-spin' : ''}
            />
            {busy ? `Запуск ${progress?.done} из ${progress?.total}` : 'Запустить все'}
          </button>
        )}

        {runningCount > 0 && (
          <button
            onClick={onStopAll}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg border border-destructive/45 px-3 py-1.5 text-[13px] font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
          >
            <Icon name="Square" fallback="CircleStop" size={12} />
            Остановить все
          </button>
        )}

        {count > 0 && (
          <button
            onClick={onClear}
            disabled={busy}
            className="rounded-lg border border-border px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-60"
          >
            Снять
          </button>
        )}
      </div>
    </div>
  );
};

export default BulkBar;

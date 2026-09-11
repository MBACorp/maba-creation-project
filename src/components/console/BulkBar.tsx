import Icon from '@/components/ui/icon';

interface BulkBarProps {
  count: number;
  progress?: { done: number; total: number } | null;
  onStart: () => void;
  onClear: () => void;
}

/* Панель массовых действий: появляется, когда отмечен хотя бы один профиль */
const BulkBar = ({ count, progress, onStart, onClear }: BulkBarProps) => {
  if (!count) return null;

  const running = Boolean(progress);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur">
        <span className="text-[13px] text-foreground">
          Выбрано: <span className="font-semibold">{count}</span>
        </span>

        <span className="h-4 w-px bg-border" />

        <button
          onClick={onStart}
          disabled={running}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Icon
            name={running ? 'Loader' : 'Play'}
            fallback="Play"
            size={13}
            className={running ? 'animate-spin' : ''}
          />
          {running ? `Запуск ${progress?.done} из ${progress?.total}` : 'Запустить все'}
        </button>

        <button
          onClick={onClear}
          disabled={running}
          className="rounded-lg border border-border px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-60"
        >
          Снять
        </button>
      </div>
    </div>
  );
};

export default BulkBar;

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ProxyRecord, countryName, flagOf } from '@/data/proxy';

interface ProxyRowProps {
  proxy: ProxyRecord;
  usedBy: number;
  index: number;
  onCheck: (p: ProxyRecord) => void;
  onDelete: (id: string) => void;
}

const STATUS_META = {
  ok: { color: 'bg-primary', label: 'работает' },
  fail: { color: 'bg-destructive', label: 'не отвечает' },
  checking: { color: 'bg-info', label: 'проверяю' },
  unknown: { color: 'bg-dot', label: 'не проверен' },
};

const ProxyRow = ({ proxy, usedBy, index, onCheck, onDelete }: ProxyRowProps) => {
  const meta = STATUS_META[proxy.status];
  const checking = proxy.status === 'checking';

  return (
    <div
      style={{ animationDelay: `${index * 40}ms` }}
      className="group grid animate-fade-up grid-cols-[1fr_100px_150px_170px_90px_84px] items-center gap-4 border-b border-line-soft px-1 py-3.5 text-[13px] text-muted-foreground transition-colors hover:bg-card/70"
    >
      <div className="min-w-0">
        <div className="tabular truncate font-medium text-foreground">
          {proxy.host}:{proxy.port}
        </div>
        {proxy.user && (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Icon name="KeyRound" size={10} />
            {proxy.user}
          </div>
        )}
        {proxy.status === 'fail' && proxy.error && (
          <div className="mt-0.5 truncate text-[11px] text-destructive" title={proxy.error}>
            {proxy.error}
          </div>
        )}
      </div>

      <div>{proxy.type}</div>

      <div className="flex items-center gap-2">
        {checking ? (
          <Icon name="Loader" size={13} className="animate-spin text-info" />
        ) : (
          <span className={cn('h-[7px] w-[7px] shrink-0 rounded-full', meta.color)} />
        )}
        <span className={proxy.status === 'ok' ? 'text-foreground' : undefined}>
          {meta.label}
        </span>
      </div>

      <div className="min-w-0">
        {proxy.status === 'ok' && proxy.ip ? (
          <>
            <div className="tabular flex items-center gap-1.5 text-foreground">
              {proxy.country && <span>{flagOf(proxy.country)}</span>}
              <span className="truncate">{proxy.ip}</span>
            </div>
            <div className="mt-0.5 truncate text-[11px]">
              {[proxy.city, countryName(proxy.country)].filter(Boolean).join(', ')}
            </div>
          </>
        ) : (
          <span>—</span>
        )}
      </div>

      <div className="tabular">
        {proxy.status === 'ok' && proxy.latency ? `${proxy.latency} мс` : '—'}
      </div>

      <div className="flex items-center justify-end gap-1">
        {usedBy > 0 && (
          <span
            className="mr-1 flex items-center gap-1 text-[12px]"
            title={`Используют профилей: ${usedBy}`}
          >
            <Icon name="Layers" size={13} className="text-dot" />
            {usedBy}
          </span>
        )}
        <button
          onClick={() => onCheck(proxy)}
          disabled={checking}
          title="Проверить"
          className="rounded-md border border-border p-1.5 transition-colors hover:border-primary/45 hover:text-primary disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={13} className={checking ? 'animate-spin' : undefined} />
        </button>
        <button
          onClick={() => onDelete(proxy.id)}
          title="Удалить"
          className="rounded-md border border-border p-1.5 opacity-0 transition-all hover:border-destructive/50 hover:text-destructive group-hover:opacity-100"
        >
          <Icon name="Trash2" size={13} />
        </button>
      </div>
    </div>
  );
};

export default ProxyRow;

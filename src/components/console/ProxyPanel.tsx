import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import ProxyRow from './ProxyRow';
import AddProxyDialog from './AddProxyDialog';
import { ProxyRecord } from '@/data/proxy';
import { Profile } from '@/data/console';

interface ProxyPanelProps {
  proxies: ProxyRecord[];
  profiles: Profile[];
  checking: boolean;
  onAdd: (text: string, autoCheck: boolean) => Promise<unknown>;
  onCheck: (targets: ProxyRecord[]) => void;
  onCheckAll: () => void;
  onDelete: (id: string) => void;
}

const ProxyPanel = ({
  proxies,
  profiles,
  checking,
  onAdd,
  onCheck,
  onCheckAll,
  onDelete,
}: ProxyPanelProps) => {
  const [addOpen, setAddOpen] = useState(false);

  const usage = useMemo(() => {
    const map = new Map<string, number>();
    profiles.forEach((p) => {
      if (p.proxyId) map.set(p.proxyId, (map.get(p.proxyId) || 0) + 1);
    });
    return map;
  }, [profiles]);

  const okCount = proxies.filter((p) => p.status === 'ok').length;
  const failCount = proxies.filter((p) => p.status === 'fail').length;
  const countries = new Set(
    proxies.filter((p) => p.country).map((p) => p.country),
  ).size;

  return (
    <div className="px-5 py-6 md:px-8">
      <div className="grid animate-fade-up gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Всего прокси',
            value: String(proxies.length),
            hint: countries ? `${countries} стран` : 'ещё не проверены',
          },
          {
            label: 'Работают',
            value: String(okCount),
            hint: failCount ? `не отвечают: ${failCount}` : 'все на связи',
          },
          {
            label: 'Привязано к профилям',
            value: String(usage.size),
            hint: `свободных: ${Math.max(0, proxies.length - usage.size)}`,
          },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {c.label}
            </div>
            <div className="mt-2 font-head text-[22px] font-extrabold tracking-tight text-foreground">
              {c.value}
            </div>
            <div className="mt-1 text-[12px] text-muted-foreground">{c.hint}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex animate-fade-up flex-wrap items-center gap-2 [animation-delay:60ms]">
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 font-head text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Icon name="Plus" size={15} />
          Добавить прокси
        </button>
        <button
          onClick={onCheckAll}
          disabled={checking || proxies.length === 0}
          className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-[13px] text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={14} className={checking ? 'animate-spin' : undefined} />
          {checking ? 'Проверяю…' : 'Проверить все'}
        </button>
      </div>

      {proxies.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <Icon name="Globe" size={26} className="text-dot" />
          <p className="text-[14px] text-muted-foreground">Прокси пока не добавлены</p>
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-lg border border-primary/45 px-3 py-1.5 text-[13px] text-primary transition-colors hover:bg-primary/10"
          >
            Добавить первый
          </button>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto scroll-thin">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[1fr_100px_150px_170px_90px_84px] gap-4 border-b border-border px-1 py-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <div>Хост и порт</div>
              <div>Тип</div>
              <div>Состояние</div>
              <div>Реальный IP</div>
              <div>Отклик</div>
              <div />
            </div>
            {proxies.map((p, i) => (
              <ProxyRow
                key={p.id}
                proxy={p}
                index={i}
                usedBy={usage.get(p.id) || 0}
                onCheck={(item) => onCheck([item])}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      <AddProxyDialog open={addOpen} onOpenChange={setAddOpen} onAdd={onAdd} />
    </div>
  );
};

export default ProxyPanel;

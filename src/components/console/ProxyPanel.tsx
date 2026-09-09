import Icon from '@/components/ui/icon';
import { proxyList } from '@/data/console';

const ProxyPanel = () => {
  return (
    <div className="px-5 py-6 md:px-8">
      <div className="grid animate-fade-up gap-3 sm:grid-cols-3">
        {[
          { label: 'Трафик за месяц', value: '2.0 ГБ', hint: 'из 5 ГБ тарифа' },
          { label: 'Активных прокси', value: String(proxyList.length), hint: '4 страны' },
          { label: 'Dedicated Unlimited', value: '$5/IP', hint: 'безлимитный трафик' },
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

      <div className="mt-6 overflow-x-auto scroll-thin">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[1fr_120px_160px_120px_100px] gap-4 border-b border-border px-1 py-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <div>Хост и порт</div>
            <div>Тип</div>
            <div>Локация</div>
            <div>Трафик</div>
            <div>Профили</div>
          </div>
          {proxyList.map((p, i) => (
            <div
              key={p.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="grid animate-fade-up grid-cols-[1fr_120px_160px_120px_100px] items-center gap-4 border-b border-line-soft px-1 py-4 text-[13px] text-muted-foreground transition-colors hover:bg-card/70"
            >
              <div className="tabular font-medium text-foreground">{p.host}</div>
              <div>{p.type}</div>
              <div className="flex items-center gap-2">
                <span>{p.flag}</span>
                {p.country}
              </div>
              <div className="tabular">{p.traffic}</div>
              <div className="flex items-center gap-2">
                <Icon name="Layers" size={14} className="text-dot" />
                {p.usedBy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProxyPanel;

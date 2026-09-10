import Icon from '@/components/ui/icon';
import { ProxyRecord, countryName, flagOf } from '@/data/proxy';

interface ProxyPickerProps {
  proxies: ProxyRecord[];
  value?: string;
  onChange: (proxyId?: string) => void;
}

const ProxyPicker = ({ proxies, value, onChange }: ProxyPickerProps) => {
  const selected = proxies.find((p) => p.id === value);

  return (
    <div className="mt-5 rounded-lg border border-border p-3.5">
      <div className="flex items-center gap-3">
        <Icon name="Globe" size={16} className="shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-head text-[13px] font-bold text-foreground">Прокси профиля</p>
          <p className="truncate text-[12px] text-muted-foreground">
            {selected
              ? `${selected.host}:${selected.port}${
                  selected.status === 'ok' && selected.country
                    ? ` · ${flagOf(selected.country)} ${countryName(selected.country)}`
                    : ''
                }`
              : 'Без прокси — прямое подключение'}
          </p>
        </div>
      </div>

      <div className="relative mt-3">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={`w-full appearance-none rounded-lg border bg-secondary px-3 py-2 pr-8 text-[13px] outline-none transition-colors focus:border-primary/60 ${
            value ? 'border-primary/40 text-foreground' : 'border-border text-muted-foreground'
          }`}
        >
          <option value="">Без прокси</option>
          {proxies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.type} · {p.host}:{p.port}
              {p.status === 'ok' && p.country ? ` — ${countryName(p.country)}` : ''}
              {p.status === 'fail' ? ' — не отвечает' : ''}
            </option>
          ))}
        </select>
        <Icon
          name="ChevronDown"
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>

      {selected && selected.status === 'fail' && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-destructive">
          <Icon name="TriangleAlert" fallback="AlertTriangle" size={12} className="mt-0.5 shrink-0" />
          Прокси не отвечает — профиль может не запуститься.
        </p>
      )}
    </div>
  );
};

export default ProxyPicker;

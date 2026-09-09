import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const tabs = [
  {
    id: 'start',
    label: 'Запуск профиля',
    code: `curl -X POST https://api.mba.app/v1/profiles/p1/start \\
  -H "Authorization: Bearer mba_live_••••" \\
  -d '{"headless": false}'`,
  },
  {
    id: 'list',
    label: 'Список профилей',
    code: `curl https://api.mba.app/v1/profiles \\
  -H "Authorization: Bearer mba_live_••••"`,
  },
  {
    id: 'mcp',
    label: 'MCP-сервер',
    code: `{
  "mcpServers": {
    "mba": {
      "command": "npx",
      "args": ["-y", "@mba/mcp-server"]
    }
  }
}`,
  },
];

const ApiPanel = () => {
  const [tab, setTab] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);
  const active = tabs.find((t) => t.id === tab) ?? tabs[0];

  const copy = () => {
    navigator.clipboard?.writeText(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="px-5 py-6 md:px-8">
      <div className="animate-fade-up rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Ключ доступа
            </div>
            <div className="tabular mt-1 font-medium text-foreground">mba_live_9f2c••••••••41a7</div>
          </div>
          <button className="rounded-lg border border-border px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            Перевыпустить
          </button>
        </div>
      </div>

      <div className="mt-5 flex animate-fade-up flex-wrap gap-2 [animation-delay:40ms]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-lg border px-3 py-2 text-[13px] transition-colors',
              tab === t.id
                ? 'border-primary/45 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mt-3 animate-fade-up overflow-x-auto scroll-thin rounded-lg border border-border bg-card p-4 [animation-delay:80ms]">
        <button
          onClick={copy}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={13} />
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
        <pre className="tabular whitespace-pre text-[13px] leading-relaxed text-foreground">
          {active.code}
        </pre>
      </div>
    </div>
  );
};

export default ApiPanel;

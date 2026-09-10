import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { AuditReport, bridge } from '@/lib/desktop';

interface FingerprintAuditProps {
  profileId: string;
  running: boolean;
}

const SITES = [
  { id: 'creepjs', label: 'CreepJS', hint: 'самый строгий детектор' },
  { id: 'pixelscan', label: 'Pixelscan', hint: 'проверка на согласованность' },
  { id: 'iphey', label: 'Iphey', hint: 'оценка доверия' },
  { id: 'browserleaks', label: 'BrowserLeaks', hint: 'подробные значения' },
];

const scoreTone = (score: number) => {
  if (score >= 90) return { text: 'text-primary', bar: 'bg-primary', label: 'отличный результат' };
  if (score >= 70) return { text: 'text-info', bar: 'bg-info', label: 'есть замечания' };
  return { text: 'text-destructive', bar: 'bg-destructive', label: 'требует внимания' };
};

const FingerprintAudit = ({ profileId, running }: FingerprintAuditProps) => {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState('creepjs');
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);

  const run = async () => {
    const api = bridge();

    if (!api) {
      toast('Проверка доступна в приложении', {
        description: 'В браузере нельзя открыть сайт через профиль с его отпечатком.',
      });
      return;
    }

    if (!running) {
      toast.error('Сначала запустите профиль', {
        description: 'Проверка идёт внутри рабочего окна — с его прокси и отпечатком.',
      });
      return;
    }

    setBusy(true);
    try {
      const result = await api.auditProfile({ id: profileId, site });
      if (!result.ok) {
        toast.error('Проверка не удалась', { description: result.error });
        return;
      }
      setReport(result);
      const tone = scoreTone(result.score || 0);
      toast(`Проверка завершена: ${result.score}%`, {
        description: `${result.passed} из ${result.total} пунктов — ${tone.label}. Сайт открыт в окне профиля.`,
      });
    } finally {
      setBusy(false);
    }
  };

  const failed = report?.checks?.filter((c) => c.status === 'fail') || [];
  const tone = scoreTone(report?.score || 0);

  return (
    <div className="mt-5 rounded-lg border border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <Icon name="ScanSearch" fallback="Search" size={16} className="shrink-0 text-primary" />
        <span className="flex-1">
          <span className="block font-head text-[13px] font-bold text-foreground">
            Проверка отпечатка
          </span>
          <span className="block text-[12px] text-muted-foreground">
            {report
              ? `${report.score}% — ${report.passed} из ${report.total} пунктов`
              : 'Посмотреть, что видят сайты'}
          </span>
        </span>
        {report && (
          <span className={cn('font-head text-[15px] font-extrabold', tone.text)}>
            {report.score}%
          </span>
        )}
        <Icon
          name={open ? 'ChevronUp' : 'ChevronDown'}
          size={15}
          className="shrink-0 text-muted-foreground"
        />
      </button>

      {open && (
        <div className="border-t border-border p-3.5">
          <div className="flex flex-wrap gap-1.5">
            {SITES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSite(s.id)}
                title={s.hint}
                className={cn(
                  'rounded-lg border px-2.5 py-1.5 text-[12px] transition-colors',
                  site === s.id
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={run}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-head text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? (
              <Icon name="Loader" size={14} className="animate-spin" />
            ) : (
              <Icon name="Play" size={14} />
            )}
            {busy ? 'Проверяю…' : 'Проверить отпечаток'}
          </button>

          {!running && (
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Icon name="Info" size={12} className="mt-0.5 shrink-0 text-primary" />
              Профиль должен быть запущен — проверка идёт в его окне, с его прокси.
            </p>
          )}

          {report && report.checks && (
            <>
              <div className="mt-4 rounded-lg border border-border bg-secondary p-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Итог по {report.site}
                  </span>
                  <span className={cn('font-head text-[20px] font-extrabold', tone.text)}>
                    {report.score}%
                  </span>
                </div>
                <div className="my-2.5 h-[3px] rounded-sm bg-border">
                  <i
                    className={cn('block h-full rounded-sm transition-all duration-500', tone.bar)}
                    style={{ width: `${report.score}%` }}
                  />
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {report.passed} из {report.total} пунктов сходятся — {tone.label}
                </p>

                <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-[12px]">
                  {[
                    { k: 'Внешний IP', v: report.publicIp || 'не определён' },
                    { k: 'Часовой пояс', v: report.actual?.timezone || '—' },
                    { k: 'Видеокарта', v: report.actual?.gpu || '—' },
                    { k: 'Экран', v: report.actual?.screen || '—' },
                    { k: 'След Canvas', v: report.actual?.canvasHash || '—' },
                  ].map((row) => (
                    <div key={row.k} className="flex items-baseline justify-between gap-3">
                      <dt className="shrink-0 text-muted-foreground">{row.k}</dt>
                      <dd className="tabular truncate text-right text-foreground" title={row.v}>
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {failed.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-destructive">
                    Расхождения — {failed.length}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {failed.map((c) => (
                      <div
                        key={c.name}
                        className="rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-2 text-[12px]"
                      >
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Icon name="X" size={11} className="shrink-0 text-destructive" />
                          {c.title}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
                          <span>задано: {c.want}</span>
                          <span className="text-destructive">сайт видит: {c.got}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer text-[12px] text-muted-foreground transition-colors hover:text-foreground">
                  Все пункты проверки
                </summary>
                <div className="mt-2 space-y-1">
                  {report.checks.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 rounded-md border border-line-soft px-2.5 py-1.5 text-[12px]"
                    >
                      <Icon
                        name={c.status === 'ok' ? 'Check' : 'X'}
                        size={11}
                        className={cn(
                          'shrink-0',
                          c.status === 'ok' ? 'text-primary' : 'text-destructive',
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate text-foreground">{c.title}</span>
                      <span className="shrink-0 truncate text-[11px] text-muted-foreground">
                        {c.got}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </>
          )}

          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Icon name="Info" size={12} className="mt-0.5 shrink-0 text-primary" />
            Показания снимаются так же, как это делают сайты-детекторы, и сверяются
            с настройками профиля. Выбранный сайт открывается в окне профиля —
            результат можно увидеть глазами.
          </p>
        </div>
      )}
    </div>
  );
};

export default FingerprintAudit;

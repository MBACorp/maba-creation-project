import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Profile } from '@/data/console';
import { bridge } from '@/lib/desktop';
import { toast } from 'sonner';
import { useWarmupSets } from '@/hooks/useWarmupSets';
import { cn } from '@/lib/utils';

interface WarmupDialogProps {
  profile: Profile | null;
  onOpenChange: (v: boolean) => void;
}

interface Progress {
  site?: string;
  visited?: number;
  total?: number;
  leftMs?: number;
  done?: boolean;
}

const STORAGE_KEY = 'mba.warmup.sites';

/* Подсказка со стартовым набором — пользователь правит под себя */
const SAMPLE = 'ozon.ru\nwildberries.ru\nyandex.ru\nlenta.ru\nkinopoisk.ru';

const WarmupDialog = ({ profile, onOpenChange }: WarmupDialogProps) => {
  const [sites, setSites] = useState('');
  const [minutes, setMinutes] = useState(20);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);

  const { sets, saveSet, deleteSet } = useWarmupSets();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setSites(saved || SAMPLE);
  }, []);

  useEffect(() => {
    const api = bridge();
    if (!api?.onWarmupProgress) return;
    api.onWarmupProgress((p) => {
      if (p.done) setProgress(null);
      else setProgress(p);
    });
  }, []);

  if (!profile) return null;

  const running = profile.status === 'running';
  const busy = Boolean(progress);
  const count = sites
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2).length;

  const start = async () => {
    const api = bridge();
    localStorage.setItem(STORAGE_KEY, sites);

    if (!api?.warmupProfile) {
      toast('Прогрев доступен в приложении для компьютера', {
        description: 'В браузере бот работать не может — нужен настоящий профиль.',
      });
      return;
    }

    setProgress({ visited: 0 });
    const res = await api.warmupProfile({ id: profile.id, sites, minutes });
    setProgress(null);

    if (!res.ok) {
      toast.error('Прогрев не выполнен', { description: res.error });
      return;
    }

    toast(`Прогрев завершён: ${res.visited} сайтов`, {
      description: res.gained ? `Новых куки: ${res.gained}` : 'Куки сохранены',
    });
    onOpenChange(false);
  };

  const stop = async () => {
    const api = bridge();
    await api?.stopWarmup?.(profile.id);
    toast('Останавливаю прогрев');
  };

  const leftMin = progress?.leftMs ? Math.ceil(progress.leftMs / 60000) : null;

  return (
    <Dialog open={Boolean(profile)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-head text-[17px]">
            Прогрев профиля «{profile.name}»
          </DialogTitle>
        </DialogHeader>

        {!running && (
          <div className="flex items-start gap-2 rounded-lg border border-primary/35 bg-primary/5 px-3 py-2.5 text-[12.5px] text-muted-foreground">
            <Icon name="Info" size={14} className="mt-px shrink-0 text-primary" />
            Сначала запустите профиль — бот работает в его окне, с его прокси.
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
            Готовые наборы
          </label>

          <div className="flex flex-wrap gap-1.5">
            {sets.map((s) => (
              <span
                key={s.id}
                className={cn(
                  'group flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[12.5px] transition-colors',
                  activeSet === s.id
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40',
                )}
              >
                <button
                  onClick={() => {
                    setSites(s.sites);
                    setActiveSet(s.id);
                  }}
                  disabled={busy}
                  className="disabled:opacity-60"
                >
                  {s.name}
                </button>
                <button
                  onClick={() => {
                    deleteSet(s.id);
                    if (activeSet === s.id) setActiveSet(null);
                    toast(`Набор «${s.name}» удалён`);
                  }}
                  disabled={busy}
                  title="Удалить набор"
                  className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive disabled:opacity-0"
                >
                  <Icon name="X" size={11} />
                </button>
              </span>
            ))}

            {sets.length === 0 && (
              <span className="text-[12px] text-dot">Пока нет сохранённых наборов</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              Сайты для обхода
            </label>

            {!saving && !busy && count > 0 && (
              <button
                onClick={() => {
                  const current = sets.find((s) => s.id === activeSet);
                  setSaveName(current ? current.name : '');
                  setSaving(true);
                }}
                className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon name="Save" fallback="Plus" size={12} />
                Сохранить набор
              </button>
            )}
          </div>

          {saving && (
            <div className="flex gap-1.5">
              <input
                autoFocus
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const res = saveSet(saveName, sites);
                    if (res) {
                      toast(
                        res === 'updated'
                          ? `Набор «${saveName.trim()}» обновлён`
                          : `Набор «${saveName.trim()}» сохранён`,
                      );
                      setSaving(false);
                      setSaveName('');
                    }
                  }
                  if (e.key === 'Escape') setSaving(false);
                }}
                placeholder="Название набора"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px] text-foreground outline-none transition-colors focus:border-primary/50"
              />
              <button
                onClick={() => {
                  const res = saveSet(saveName, sites);
                  if (!res) {
                    toast.error('Введите название набора');
                    return;
                  }
                  toast(
                    res === 'updated'
                      ? `Набор «${saveName.trim()}» обновлён`
                      : `Набор «${saveName.trim()}» сохранён`,
                  );
                  setSaving(false);
                  setSaveName('');
                }}
                className="rounded-lg bg-primary px-3 py-1.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-90"
              >
                Сохранить
              </button>
              <button
                onClick={() => setSaving(false)}
                className="rounded-lg border border-border px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Отмена
              </button>
            </div>
          )}

          <textarea
            value={sites}
            onChange={(e) => {
              setSites(e.target.value);
              setActiveSet(null);
            }}
            disabled={busy}
            rows={6}
            spellCheck={false}
            placeholder={'ozon.ru\navito.ru'}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors focus:border-primary/50 disabled:opacity-60"
          />
          <p className="text-[11.5px] text-dot">
            По одному адресу в строке. Можно «ozon.ru» или «ozon,ru» — понимаю оба.
            {count > 0 && <span className="text-muted-foreground"> Сейчас: {count}</span>}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              Время прогрева
            </label>
            <span className="tabular text-[13px] font-semibold text-foreground">
              {minutes} мин
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={minutes}
            disabled={busy}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full accent-primary disabled:opacity-60"
          />
          <p className="text-[11.5px] text-dot">
            15–30 минут выглядят естественнее всего. Спешка заметна площадкам.
          </p>
        </div>

        {busy && (
          <div className="rounded-lg border border-border bg-card/70 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <Icon name="Loader" size={13} className="animate-spin text-primary" />
              {progress?.site ? `Читаю ${progress.site}` : 'Открываю первый сайт'}
            </div>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              Пройдено сайтов: {progress?.visited ?? 0}
              {leftMin ? ` · осталось около ${leftMin} мин` : ''}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {busy ? (
            <button
              onClick={stop}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-destructive/45 px-3 py-2 text-[13px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <Icon name="Square" size={12} />
              Остановить прогрев
            </button>
          ) : (
            <button
              onClick={start}
              disabled={!running || count === 0}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Icon name="Flame" fallback="Play" size={14} />
              Начать прогрев
            </button>
          )}
        </div>

        <p className="text-[11.5px] leading-relaxed text-dot">
          Бот листает страницы и заходит вглубь сайтов, как это делает человек. Прогрев убирает
          приметы пустого профиля, но не заменяет живую работу в нём.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default WarmupDialog;
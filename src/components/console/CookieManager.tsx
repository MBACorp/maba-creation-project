import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import {
  CookieRecord,
  CookieSummary,
  EMPTY_SUMMARY,
  downloadFile,
  parseCookies,
  summarize,
  toNetscape,
} from '@/data/cookies';
import { bridge } from '@/lib/desktop';

interface CookieManagerProps {
  profileId: string;
  profileName: string;
}

const STORAGE_PREFIX = 'mba.cookies.';

/* В браузере куки профиля живут локально — чтобы демо было честным */
const readLocal = (profileId: string): CookieRecord[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + profileId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocal = (profileId: string, cookies: CookieRecord[]) => {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + profileId, JSON.stringify(cookies));
  } catch {
    /* хранилище переполнено */
  }
};

const CookieManager = ({ profileId, profileName }: CookieManagerProps) => {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<CookieSummary>(EMPTY_SUMMARY);
  const [busy, setBusy] = useState(false);
  const [replace, setReplace] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const api = bridge();
    if (api) {
      const data = await api.listCookies(profileId);
      setSummary(data || EMPTY_SUMMARY);
    } else {
      setSummary(summarize(readLocal(profileId)));
    }
  }, [profileId]);

  useEffect(() => {
    setConfirmClear(false);
    load();
  }, [load]);

  const applyText = async (text: string, sourceName?: string) => {
    setBusy(true);
    try {
      const api = bridge();

      if (api) {
        const result = await api.importCookies({ profileId, text, replace });
        if (!result.ok) {
          toast.error('Не удалось загрузить куки', { description: result.error });
          return;
        }
        setSummary(result.summary || EMPTY_SUMMARY);
        toast(`Загружено куки: ${result.added}`, {
          description: `Всего в профиле: ${result.total}${sourceName ? ` · ${sourceName}` : ''}`,
        });
        return;
      }

      const parsed = parseCookies(text);
      if (!parsed.length) {
        toast.error('В файле не найдено ни одной куки');
        return;
      }
      const current = replace ? [] : readLocal(profileId);
      const map = new Map<string, CookieRecord>();
      current.concat(parsed).forEach((c) => map.set(`${c.domain}|${c.path}|${c.name}`, c));
      const merged = [...map.values()];

      writeLocal(profileId, merged);
      setSummary(summarize(merged));
      toast(`Загружено куки: ${parsed.length}`, {
        description: `Всего в профиле: ${merged.length}`,
      });
    } catch (error) {
      toast.error('Не удалось разобрать файл', {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  const pickFile = async () => {
    const api = bridge();
    if (api) {
      const picked = await api.pickCookieFile();
      if (!picked.ok || !picked.text) return;
      await applyText(picked.text, picked.name);
      return;
    }
    fileRef.current?.click();
  };

  const onFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    await applyText(text, file.name);
  };

  const exportAs = async (format: 'json' | 'netscape') => {
    const api = bridge();
    if (api) {
      const result = await api.exportCookies({ profileId, profileName, format });
      if (result.canceled) return;
      if (!result.ok) {
        toast.error('Не удалось сохранить', { description: result.error });
        return;
      }
      toast(`Сохранено куки: ${result.count}`);
      return;
    }

    const cookies = readLocal(profileId);
    if (!cookies.length) {
      toast.error('У профиля нет сохранённых куки');
      return;
    }
    const safe = profileName.replace(/[^A-Za-zА-Яа-я0-9_-]+/g, '_');
    if (format === 'netscape') {
      downloadFile(toNetscape(cookies), `${safe}-cookies.txt`, 'text/plain');
    } else {
      downloadFile(JSON.stringify(cookies, null, 2), `${safe}-cookies.json`, 'application/json');
    }
    toast(`Сохранено куки: ${cookies.length}`);
  };

  const clearAll = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    const api = bridge();
    if (api) await api.clearCookies(profileId);
    else writeLocal(profileId, []);
    setSummary(EMPTY_SUMMARY);
    setConfirmClear(false);
    toast('Куки профиля удалены');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const text = await file.text();
    await applyText(text, file.name);
  };

  return (
    <div className="mt-5 rounded-lg border border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <Icon name="Cookie" fallback="CircleDot" size={16} className="shrink-0 text-primary" />
        <span className="flex-1">
          <span className="block font-head text-[13px] font-bold text-foreground">Куки</span>
          <span className="block text-[12px] text-muted-foreground">
            {summary.total
              ? `${summary.total} шт. на ${summary.domains.length} сайтах`
              : 'Не загружены — можно перенести из другого браузера'}
          </span>
        </span>
        <Icon
          name={open ? 'ChevronUp' : 'ChevronDown'}
          size={15}
          className="shrink-0 text-muted-foreground"
        />
      </button>

      {open && (
        <div className="border-t border-border p-3.5">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-5 text-center transition-colors hover:border-primary/40"
          >
            <Icon name="Upload" size={18} className="text-primary" />
            <p className="text-[13px] text-foreground">Перетащите файл или выберите вручную</p>
            <p className="text-[11px] text-muted-foreground">
              Поддерживаются JSON и Netscape cookies.txt
            </p>
            <button
              onClick={pickFile}
              disabled={busy}
              className="mt-1 flex items-center gap-2 rounded-lg bg-primary px-3.5 py-1.5 font-head text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Icon name="Loader" size={13} className="animate-spin" />}
              {busy ? 'Загружаю…' : 'Выбрать файл'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,.txt"
              onChange={onFileChosen}
              className="hidden"
            />
          </div>

          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-muted-foreground">
            <input
              type="checkbox"
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
              className="h-3.5 w-3.5 accent-primary"
            />
            Заменить текущие куки, а не дополнять
          </label>

          {summary.domains.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Сайты
              </p>
              <div className="mt-2 max-h-52 space-y-1 overflow-y-auto scroll-thin pr-1">
                {summary.domains.map((d) => (
                  <div
                    key={d.domain}
                    className="flex items-center gap-2 rounded-md border border-line-soft px-2.5 py-1.5 text-[12px]"
                  >
                    <Icon name="Globe" size={11} className="shrink-0 text-dot" />
                    <span className="min-w-0 flex-1 truncate text-foreground">{d.domain}</span>
                    {d.expired > 0 && (
                      <span className="shrink-0 text-[10px] text-destructive" title="Истёкшие">
                        {d.expired} истек.
                      </span>
                    )}
                    {d.session > 0 && (
                      <span className="shrink-0 text-[10px] text-muted-foreground" title="Сессионные">
                        {d.session} сесс.
                      </span>
                    )}
                    <span className="shrink-0 tabular-nums text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => exportAs('json')}
              disabled={!summary.total}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary disabled:opacity-40"
            >
              <Icon name="Download" size={13} />
              JSON
            </button>
            <button
              onClick={() => exportAs('netscape')}
              disabled={!summary.total}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary disabled:opacity-40"
            >
              <Icon name="Download" size={13} />
              cookies.txt
            </button>
            <button
              onClick={clearAll}
              disabled={!summary.total}
              className={`ml-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] transition-colors disabled:opacity-40 ${
                confirmClear
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive'
              }`}
            >
              <Icon name="Trash2" size={13} />
              {confirmClear ? 'Точно очистить?' : 'Очистить'}
            </button>
          </div>

          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Icon name="Info" size={12} className="mt-0.5 shrink-0 text-primary" />
            Куки подставляются в браузер при запуске профиля и сохраняются обратно
            после работы — сессии не теряются между запусками.
          </p>
        </div>
      )}
    </div>
  );
};

export default CookieManager;

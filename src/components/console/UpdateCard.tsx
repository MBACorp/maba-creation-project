import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { bridge, isDesktop } from '@/lib/desktop';

type Stage = 'idle' | 'checking' | 'fresh' | 'found' | 'error';

const UpdateCard = () => {
  const [version, setVersion] = useState<string>('');
  const [stage, setStage] = useState<Stage>('idle');
  const [note, setNote] = useState('');

  useEffect(() => {
    const api = bridge();
    if (!api) return;
    api
      .appInfo()
      .then((info) => setVersion(info.version))
      .catch(() => undefined);
  }, []);

  if (!isDesktop()) return null;

  const check = async () => {
    const api = bridge();
    if (!api) return;

    setStage('checking');
    setNote('Проверяю…');

    try {
      const res = (await api.checkUpdate({ silent: true })) as {
        available?: boolean;
        version?: string;
        error?: string;
      };

      if (res?.error) {
        setStage('error');
        setNote('Не удалось проверить');
        return;
      }

      if (res?.available) {
        setStage('found');
        setNote(`Доступна версия ${res.version}`);
        return;
      }

      setStage('fresh');
      setNote('Установлена последняя версия');
    } catch (e) {
      setStage('error');
      setNote('Не удалось проверить');
    }
  };

  const reloadUi = () => {
    window.location.reload();
  };

  return (
    <div className="animate-fade-up rounded-lg border border-border p-3.5 [animation-delay:140ms]">
      <div className="flex items-baseline justify-between">
        <span className="font-head text-[13px] font-bold text-foreground">Обновления</span>
        {version && <span className="text-[11px] text-muted-foreground">v{version}</span>}
      </div>

      {note && (
        <p
          className={`mt-1.5 text-[11px] leading-snug ${
            stage === 'found'
              ? 'text-primary'
              : stage === 'error'
                ? 'text-destructive'
                : 'text-muted-foreground'
          }`}
        >
          {note}
        </p>
      )}

      <div className="mt-2.5 flex gap-2">
        <button
          onClick={check}
          disabled={stage === 'checking'}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[12px] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Icon
            name={stage === 'checking' ? 'Loader' : 'RefreshCw'}
            fallback="RefreshCw"
            size={13}
            className={stage === 'checking' ? 'animate-spin' : ''}
          />
          Проверить
        </button>

        <button
          onClick={reloadUi}
          title="Загрузить свежую версию интерфейса"
          className="flex items-center justify-center rounded-md border border-border px-2.5 py-1.5 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Icon name="RotateCw" fallback="RefreshCw" size={13} />
        </button>
      </div>
    </div>
  );
};

export default UpdateCard;

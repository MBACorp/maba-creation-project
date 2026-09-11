import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { bridge, isDesktop, type UpdateState } from '@/lib/desktop';

const UpdateCard = () => {
  const [version, setVersion] = useState<string>('');
  const [state, setState] = useState<UpdateState>({ status: 'idle' });

  useEffect(() => {
    const api = bridge();
    if (!api) return;

    api
      .appInfo()
      .then((info) => setVersion(info.version))
      .catch(() => undefined);

    api.updateState().then(setState).catch(() => undefined);
    api.onUpdateState(setState);
  }, []);

  if (!isDesktop()) return null;

  const check = async () => {
    const api = bridge();
    if (!api) return;
    setState({ status: 'checking' });
    await api.checkUpdate({ silent: false }).catch(() => undefined);
  };

  const busy = state.status === 'checking' || state.status === 'downloading';

  const message = () => {
    switch (state.status) {
      case 'checking':
        return 'Проверяю наличие обновлений…';
      case 'available':
        return `Доступна версия ${state.version}`;
      case 'downloading':
        return `Загружаю версию ${state.version} — ${state.percent ?? 0}%`;
      case 'ready':
        return `Версия ${state.version} готова к установке`;
      case 'postponed':
        return `Версия ${state.version} отложена`;
      case 'error':
        return state.error || 'Не удалось проверить обновления';
      default:
        return state.current ? 'Установлена последняя версия' : '';
    }
  };

  const tone =
    state.status === 'error'
      ? 'text-destructive'
      : state.status === 'available' || state.status === 'ready'
        ? 'text-primary'
        : 'text-muted-foreground';

  const note = message();

  return (
    <div className="animate-fade-up rounded-lg border border-border p-3.5 [animation-delay:140ms]">
      <div className="flex items-baseline justify-between">
        <span className="font-head text-[13px] font-bold text-foreground">Обновления</span>
        {version && <span className="text-[11px] text-muted-foreground">v{version}</span>}
      </div>

      {note && <p className={`mt-1.5 text-[11px] leading-snug ${tone}`}>{note}</p>}

      {state.status === 'downloading' && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${state.percent ?? 0}%` }}
          />
        </div>
      )}

      <div className="mt-2.5 flex gap-2">
        <button
          onClick={check}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[12px] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Icon
            name={busy ? 'Loader' : 'RefreshCw'}
            fallback="RefreshCw"
            size={13}
            className={busy ? 'animate-spin' : ''}
          />
          {state.status === 'downloading' ? 'Загрузка…' : 'Проверить'}
        </button>

        <button
          onClick={() => window.location.reload()}
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

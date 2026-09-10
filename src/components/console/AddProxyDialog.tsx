import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ProxyType, parseProxyList } from '@/data/proxy';

interface AddProxyDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (text: string, autoCheck: boolean) => Promise<unknown>;
}

const TYPES: ProxyType[] = ['socks5', 'http', 'https'];

const AddProxyDialog = ({ open, onOpenChange, onAdd }: AddProxyDialogProps) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [type, setType] = useState<ProxyType>('socks5');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [bulk, setBulk] = useState('');
  const [autoCheck, setAutoCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const preview = mode === 'bulk' ? parseProxyList(bulk) : null;

  const reset = () => {
    setHost('');
    setPort('');
    setUser('');
    setPassword('');
    setBulk('');
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let text = '';

    if (mode === 'single') {
      if (!host.trim() || !port.trim()) {
        setError('Укажите адрес и порт');
        return;
      }
      const creds = user.trim() ? `${user.trim()}:${password}@` : '';
      text = `${type}://${creds}${host.trim()}:${port.trim()}`;
    } else {
      if (!bulk.trim()) {
        setError('Вставьте список прокси');
        return;
      }
      text = bulk;
    }

    setLoading(true);
    try {
      await onAdd(text, autoCheck);
      reset();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/50';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-head text-[18px] font-extrabold tracking-tight">
            Добавить прокси
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Доступность проверяется сразу после добавления.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          {[
            { id: 'single' as const, label: 'Один прокси' },
            { id: 'bulk' as const, label: 'Списком' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setMode(t.id);
                setError('');
              }}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-[13px] transition-colors',
                mode === t.id
                  ? 'border-primary/45 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'single' ? (
            <>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Протокол
                </label>
                <div className="flex gap-2">
                  {TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-[13px] transition-colors',
                        type === t
                          ? 'border-primary/45 text-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_120px] gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Адрес
                  </label>
                  <input
                    value={host}
                    onChange={(e) => {
                      setHost(e.target.value);
                      setError('');
                    }}
                    placeholder="46.17.43.24"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Порт
                  </label>
                  <input
                    value={port}
                    onChange={(e) => {
                      setPort(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    placeholder="1080"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Логин
                  </label>
                  <input
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="не обязательно"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="не обязательно"
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Список прокси — по одному в строке
              </label>
              <textarea
                value={bulk}
                onChange={(e) => {
                  setBulk(e.target.value);
                  setError('');
                }}
                rows={6}
                placeholder={'46.17.43.24:1080\nsocks5://user:pass@91.214.68.7:1085\nhttp://185.44.12.90:8080'}
                className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-[13px] text-foreground outline-none focus:border-primary/50"
              />
              {preview && (bulk.trim() ? true : false) && (
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Распознано: <span className="text-primary">{preview.valid.length}</span>
                  {preview.invalid.length > 0 && ` · с ошибкой: ${preview.invalid.length}`}
                </p>
              )}
            </div>
          )}

          {error && <p className="text-[12px] text-destructive">{error}</p>}

          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-muted-foreground">
            <input
              type="checkbox"
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Проверить доступность сразу
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-head text-[14px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Icon name="Loader" size={15} className="animate-spin" />}
            {loading ? 'Проверяю…' : 'Добавить'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProxyDialog;

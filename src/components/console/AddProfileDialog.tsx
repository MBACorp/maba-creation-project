import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Profile } from '@/data/console';

interface AddProfileDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: Omit<Profile, 'id'>) => void;
}

const proxyOptions = [
  { type: 'socks5', country: 'US', flag: '🇺🇸', ip: '46.17.44.90' },
  { type: 'socks5', country: 'NL', flag: '🇳🇱', ip: '185.44.12.77' },
  { type: 'http', country: 'DE', flag: '🇩🇪', ip: '91.214.68.31' },
  { type: '—', country: '', flag: '', ip: '—' },
];

const AddProfileDialog = ({ open, onOpenChange, onCreate }: AddProfileDialogProps) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [proxy, setProxy] = useState(0);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Имя профиля — минимум 2 символа');
      return;
    }
    const p = proxyOptions[proxy];
    onCreate({
      name: name.trim(),
      status: 'ready',
      note: note.trim() || 'без заметки',
      proxyType: p.type,
      country: p.country,
      flag: p.flag,
      ip: p.ip,
      tags: [],
      lastRun: 'ещё не запускался',
    });
    setName('');
    setNote('');
    setProxy(0);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-head text-[18px] font-extrabold tracking-tight">
            Новый профиль
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Уникальный отпечаток создаётся автоматически.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Имя профиля
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Например, Shop US / retail"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/50"
            />
            {error && <p className="mt-1.5 text-[12px] text-destructive">{error}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Заметка
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="карточный, почта, реклама…"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Прокси
            </label>
            <div className="flex flex-wrap gap-2">
              {proxyOptions.map((p, i) => (
                <button
                  type="button"
                  key={p.ip}
                  onClick={() => setProxy(i)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-[13px] transition-colors',
                    proxy === i
                      ? 'border-primary/45 text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {p.type === '—' ? 'Без прокси' : `${p.flag} ${p.type} · ${p.country}`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 font-head text-[14px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Создать профиль
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfileDialog;

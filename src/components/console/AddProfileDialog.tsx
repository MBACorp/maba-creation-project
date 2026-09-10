import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Profile } from '@/data/console';
import { ProxyRecord, countryName, flagOf } from '@/data/proxy';
import { Folder, parseTags } from '@/data/folders';

interface AddProfileDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: Omit<Profile, 'id'>) => void;
  proxies: ProxyRecord[];
  folders: Folder[];
  defaultFolder?: string;
}

const AddProfileDialog = ({
  open,
  onOpenChange,
  onCreate,
  proxies,
  folders,
  defaultFolder,
}: AddProfileDialogProps) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [proxyId, setProxyId] = useState('');
  const [folderId, setFolderId] = useState(defaultFolder || '');
  const [tagsRaw, setTagsRaw] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) setFolderId(defaultFolder || '');
  }, [open, defaultFolder]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Имя профиля — минимум 2 символа');
      return;
    }
    const p = proxies.find((x) => x.id === proxyId);
    onCreate({
      name: name.trim(),
      status: 'ready',
      note: note.trim() || 'без заметки',
      proxyId: p?.id,
      proxyType: p?.type || '—',
      country: p?.country || '',
      flag: p?.country ? flagOf(p.country) : '',
      ip: p?.ip || '—',
      tags: parseTags(tagsRaw),
      folderId: folderId || undefined,
      lastRun: 'ещё не запускался',
    });
    setName('');
    setNote('');
    setProxyId('');
    setTagsRaw('');
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Папка
              </label>
              <div className="relative">
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className={`w-full appearance-none rounded-lg border bg-transparent px-3 py-2 pr-8 text-[14px] outline-none focus:border-primary/50 ${
                    folderId ? 'border-primary/40 text-foreground' : 'border-border text-muted-foreground'
                  }`}
                >
                  <option value="">Без папки</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDown"
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Теги
              </label>
              <input
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="карты, US"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Прокси
            </label>
            <div className="relative">
              <select
                value={proxyId}
                onChange={(e) => setProxyId(e.target.value)}
                className={`w-full appearance-none rounded-lg border bg-transparent px-3 py-2 pr-8 text-[14px] outline-none focus:border-primary/50 ${
                  proxyId ? 'border-primary/40 text-foreground' : 'border-border text-muted-foreground'
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
            {proxies.length === 0 && (
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Прокси пока не добавлены — их можно привязать позже в разделе «Прокси».
              </p>
            )}
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
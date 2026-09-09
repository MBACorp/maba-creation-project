import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Platform, RELEASES_URL } from '@/data/releases';

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  onPublished: () => void;
}

const readFileAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });

const PublishDialog = ({ open, onClose, onPublished }: PublishDialogProps) => {
  const [token, setToken] = useState('');
  const [version, setVersion] = useState('');
  const [platform, setPlatform] = useState<Platform>('windows');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!token.trim()) return toast.error('Введите пароль администратора');
    if (!version.trim()) return toast.error('Укажите номер версии');
    if (!file) return toast.error('Прикрепите файл установщика');

    setLoading(true);
    try {
      const fileBase64 = await readFileAsBase64(file);
      const res = await fetch(RELEASES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token.trim(),
        },
        body: JSON.stringify({
          action: 'upload',
          version: version.trim(),
          platform,
          notes: notes.trim(),
          fileName: file.name,
          fileBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не удалось опубликовать версию');

      toast.success(`Версия ${version} для ${platform === 'windows' ? 'Windows' : 'macOS'} опубликована`);
      setVersion('');
      setNotes('');
      setFile(null);
      onPublished();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка публикации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-foreground">Новая версия</h3>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Загрузите установщик — пользователи увидят обновление сразу
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[12px] text-muted-foreground">Пароль администратора</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-muted-foreground">Версия</label>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="mt-1.5 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground">Платформа</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="mt-1.5 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary/60"
              >
                <option value="windows">Windows</option>
                <option value="macos">macOS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground">Что нового</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ускорили запуск профилей, починили импорт прокси"
              className="mt-1.5 w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="text-[12px] text-muted-foreground">Файл установщика</label>
            <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-secondary px-3 py-3 text-[13px] text-muted-foreground hover:border-primary/50">
              <Icon name="Upload" size={15} />
              <span className="truncate">{file ? file.name : 'Выбрать .exe или .dmg'}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Rocket" size={16} />}
          {loading ? 'Публикую…' : 'Опубликовать версию'}
        </button>
      </div>
    </div>
  );
};

export default PublishDialog;

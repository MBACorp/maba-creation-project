import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { normalizeTag } from '@/data/folders';

interface TagEditorProps {
  tags: string[];
  suggestions?: string[];
  onChange: (tags: string[]) => void;
}

const TagEditor = ({ tags, suggestions = [], onChange }: TagEditorProps) => {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const clean = normalizeTag(raw);
    if (!clean || tags.includes(clean)) {
      setDraft('');
      return;
    }
    onChange([...tags, clean]);
    setDraft('');
  };

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const free = suggestions.filter((s) => !tags.includes(s)).slice(0, 6);

  return (
    <div className="mt-5 rounded-lg border border-border p-3.5">
      <div className="flex items-center gap-3">
        <Icon name="Tag" size={16} className="shrink-0 text-primary" />
        <div>
          <p className="font-head text-[13px] font-bold text-foreground">Теги</p>
          <p className="text-[12px] text-muted-foreground">
            {tags.length ? `${tags.length} шт. — по ним можно фильтровать` : 'Помогут группировать профили'}
          </p>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 rounded-md border border-primary/35 bg-primary/5 px-2 py-1 text-[12px] text-foreground"
            >
              {t}
              <button
                onClick={() => remove(t)}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Icon name="X" size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
          }
          if (e.key === 'Backspace' && !draft && tags.length) {
            remove(tags[tags.length - 1]);
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder="Добавить тег и нажать Enter"
        className="mt-3 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/60"
      />

      {free.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Часто используются:</span>
          {free.map((s) => (
            <button
              key={s}
              onClick={() => add(s)}
              className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagEditor;

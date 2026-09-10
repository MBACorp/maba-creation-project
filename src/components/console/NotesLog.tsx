import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ProfileNote, STATUS_LABELS, formatNoteDate, labelById } from '@/data/labels';

interface NotesLogProps {
  notes: ProfileNote[];
  currentLabel?: string;
  onAdd: (text: string, labelId?: string) => void;
  onDelete: (noteId: string) => void;
}

const NotesLog = ({ notes, currentLabel, onAdd, onDelete }: NotesLogProps) => {
  const [text, setText] = useState('');
  const [withLabel, setWithLabel] = useState<string | undefined>();
  const [expanded, setExpanded] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text, withLabel);
    setText('');
    setWithLabel(undefined);
  };

  const visible = expanded ? notes : notes.slice(0, 4);

  return (
    <div className="mt-5 rounded-lg border border-border p-3.5">
      <div className="flex items-center gap-3">
        <Icon name="NotebookPen" fallback="FileText" size={16} className="shrink-0 text-primary" />
        <div>
          <p className="font-head text-[13px] font-bold text-foreground">Заметки</p>
          <p className="text-[12px] text-muted-foreground">
            {notes.length ? `Записей: ${notes.length}` : 'История работы с профилем'}
          </p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
        }}
        rows={2}
        placeholder="Что произошло с профилем…"
        className="mt-3 w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/60"
      />

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">Сменить метку:</span>
        {STATUS_LABELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setWithLabel(withLabel === l.id ? undefined : l.id)}
            title={l.name}
            className={cn(
              'flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] transition-colors',
              withLabel === l.id
                ? l.chip
                : 'border-border text-muted-foreground hover:text-foreground',
              currentLabel === l.id && withLabel !== l.id && 'opacity-40',
            )}
          >
            <span className={cn('h-[5px] w-[5px] rounded-full', l.dot)} />
            {l.name}
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!text.trim()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 font-head text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <Icon name="Plus" size={14} />
        Добавить запись
      </button>

      {notes.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          {visible.map((note) => {
            const label = labelById(note.labelId);
            return (
              <div
                key={note.id}
                className="group rounded-lg border border-line-soft px-3 py-2 transition-colors hover:border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {formatNoteDate(note.createdAt)}
                  </span>
                  {label && (
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded border px-1.5 py-px text-[10px]',
                        label.chip,
                      )}
                    >
                      <span className={cn('h-[5px] w-[5px] rounded-full', label.dot)} />
                      {label.name}
                    </span>
                  )}
                  <button
                    onClick={() => onDelete(note.id)}
                    className="ml-auto text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
                  >
                    <Icon name="X" size={11} />
                  </button>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground">
                  {note.text}
                </p>
              </div>
            );
          })}

          {notes.length > 4 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full text-[12px] text-muted-foreground transition-colors hover:text-primary"
            >
              {expanded ? 'Свернуть' : `Показать все — ещё ${notes.length - 4}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesLog;

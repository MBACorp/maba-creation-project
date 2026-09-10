import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ALL_FOLDER, FOLDER_COLORS, Folder, NO_FOLDER, colorClass } from '@/data/folders';

interface FolderListProps {
  folders: Folder[];
  counts: Record<string, number>;
  active: string;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onRecolor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onDropProfiles: (ids: string[], folderId?: string, folderName?: string) => void;
}

const FolderList = ({
  folders,
  counts,
  active,
  onSelect,
  onCreate,
  onRename,
  onRecolor,
  onDelete,
  onDropProfiles,
}: FolderListProps) => {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [palette, setPalette] = useState<string | null>(null);

  const readIds = (e: React.DragEvent) => {
    const raw = e.dataTransfer.getData('application/mba-profiles');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  };

  const handleDrop = (e: React.DragEvent, folderId?: string, folderName?: string) => {
    e.preventDefault();
    setDropTarget(null);
    const ids = readIds(e);
    if (ids.length) onDropProfiles(ids, folderId, folderName);
  };

  const submitNew = () => {
    if (draft.trim()) onCreate(draft);
    setDraft('');
    setAdding(false);
  };

  const rows = [
    { id: ALL_FOLDER, name: 'Все профили', color: '', system: true },
    ...folders.map((f) => ({ ...f, system: false })),
    { id: NO_FOLDER, name: 'Без папки', color: '', system: true },
  ];

  return (
    <div className="animate-fade-up [animation-delay:100ms]">
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Папки
        </span>
        <button
          onClick={() => setAdding(true)}
          className="text-muted-foreground transition-colors hover:text-primary"
          title="Новая папка"
        >
          <Icon name="FolderPlus" size={14} />
        </button>
      </div>

      <ul className="space-y-0.5">
        {rows.map((row) => {
          const isActive = active === row.id;
          const count = counts[row.id] || 0;
          const canDrop = row.id !== ALL_FOLDER;
          const folderId = row.id === NO_FOLDER ? undefined : row.id;

          return (
            <li key={row.id}>
              <div
                onDragOver={(e) => {
                  if (!canDrop) return;
                  e.preventDefault();
                  setDropTarget(row.id);
                }}
                onDragLeave={() => setDropTarget((t) => (t === row.id ? null : t))}
                onDrop={(e) => canDrop && handleDrop(e, folderId, row.name)}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors',
                  isActive
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/60',
                  dropTarget === row.id && 'ring-1 ring-primary/60 bg-primary/10',
                )}
              >
                {row.system ? (
                  <Icon
                    name={row.id === ALL_FOLDER ? 'LayoutGrid' : 'FolderOpen'}
                    size={14}
                    className={isActive ? 'text-primary' : 'text-dot'}
                  />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPalette(palette === row.id ? null : row.id);
                    }}
                    className={cn('h-2.5 w-2.5 shrink-0 rounded-sm', colorClass(row.color))}
                    title="Цвет папки"
                  />
                )}

                {editing === row.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => {
                      onRename(row.id, editValue);
                      setEditing(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onRename(row.id, editValue);
                        setEditing(null);
                      }
                      if (e.key === 'Escape') setEditing(null);
                    }}
                    className="min-w-0 flex-1 rounded border border-primary/40 bg-transparent px-1.5 py-0.5 text-[13px] text-foreground outline-none"
                  />
                ) : (
                  <button
                    onClick={() => onSelect(row.id)}
                    onDoubleClick={() => {
                      if (row.system) return;
                      setEditing(row.id);
                      setEditValue(row.name);
                    }}
                    className="min-w-0 flex-1 truncate text-left text-[13px]"
                  >
                    {row.name}
                  </button>
                )}

                <span className="text-[11px] tabular-nums text-muted-foreground">{count}</span>

                {!row.system && editing !== row.id && (
                  <button
                    onClick={() => onDelete(row.id)}
                    className="text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
                    title="Удалить папку"
                  >
                    <Icon name="X" size={12} />
                  </button>
                )}
              </div>

              {palette === row.id && !row.system && (
                <div className="mt-1 flex gap-1.5 px-2.5 pb-1">
                  {FOLDER_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onRecolor(row.id, c.id);
                        setPalette(null);
                      }}
                      className={cn(
                        'h-3.5 w-3.5 rounded-sm transition-transform hover:scale-125',
                        c.class,
                        row.color === c.id && 'ring-1 ring-foreground ring-offset-1 ring-offset-card',
                      )}
                      title={c.label}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {adding && (
        <div className="mt-1.5 px-1">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submitNew}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitNew();
              if (e.key === 'Escape') {
                setDraft('');
                setAdding(false);
              }
            }}
            placeholder="Название папки"
            className="w-full rounded-lg border border-primary/40 bg-transparent px-2.5 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}
    </div>
  );
};

export default FolderList;

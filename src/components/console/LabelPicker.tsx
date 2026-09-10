import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { STATUS_LABELS, labelById } from '@/data/labels';

interface LabelPickerProps {
  value?: string;
  compact?: boolean;
  onChange: (labelId?: string) => void;
}

const LabelPicker = ({ value, compact, onChange }: LabelPickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = labelById(value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cn(
          'flex items-center gap-1.5 rounded-md border transition-colors',
          compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1.5 text-[13px]',
          label ? label.chip : 'border-border text-muted-foreground hover:text-foreground',
        )}
      >
        <span className={cn('h-[6px] w-[6px] shrink-0 rounded-full', label ? label.dot : 'bg-dot')} />
        {label ? label.name : 'Без метки'}
        {!compact && <Icon name="ChevronDown" size={12} className="ml-auto shrink-0" />}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
          {STATUS_LABELS.map((l) => (
            <button
              key={l.id}
              onClick={(e) => {
                e.stopPropagation();
                onChange(l.id === value ? undefined : l.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-accent',
                l.id === value ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <span className={cn('h-2 w-2 shrink-0 rounded-full', l.dot)} />
              {l.name}
              {l.id === value && <Icon name="Check" size={12} className="ml-auto text-primary" />}
            </button>
          ))}
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
                setOpen(false);
              }}
              className="mt-1 flex w-full items-center gap-2.5 border-t border-border px-3 py-1.5 text-left text-[12px] text-muted-foreground transition-colors hover:text-destructive"
            >
              <Icon name="X" size={11} />
              Снять метку
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LabelPicker;

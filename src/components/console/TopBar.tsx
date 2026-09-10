import Icon from '@/components/ui/icon';

interface TopBarProps {
  crumb: string;
  desktop?: boolean;
  onInvite: () => void;
}

const TopBar = ({ crumb, desktop, onInvite }: TopBarProps) => {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
      </div>

      <nav className="hidden items-center gap-2 text-[13px] text-muted-foreground sm:flex">
        <span>email</span>
        <Icon name="ChevronRight" size={13} />
        <span className="text-foreground">{crumb}</span>
      </nav>

      <div className="flex items-center gap-2">
      <span
        className={`hidden items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] md:flex ${
          desktop
            ? 'border-primary/35 text-primary'
            : 'border-border text-muted-foreground'
        }`}
        title={
          desktop
            ? 'Антидетект-ядро активно: профили запускаются с подменой отпечатков'
            : 'Демо в браузере. Установите приложение, чтобы запускать профили по-настоящему'
        }
      >
        <Icon name={desktop ? 'ShieldCheck' : 'Globe'} size={12} />
        {desktop ? 'Ядро активно' : 'Демо-режим'}
      </span>
      <button
        onClick={onInvite}
        className="flex items-center gap-2 rounded-lg border border-primary/40 px-3 py-1.5 text-[13px] font-medium text-primary transition-colors hover:bg-primary/10"
      >
        <Icon name="Users" size={14} />
        <span className="hidden sm:inline">Пригласи и получи 150$</span>
        <span className="sm:hidden">150$</span>
      </button>
      </div>
    </header>
  );
};

export default TopBar;
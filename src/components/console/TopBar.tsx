import Icon from '@/components/ui/icon';

interface TopBarProps {
  crumb: string;
  onInvite: () => void;
}

const TopBar = ({ crumb, onInvite }: TopBarProps) => {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
      </div>

      <nav className="hidden items-center gap-2 text-[13px] text-muted-foreground sm:flex">
        <span>aleksandrgricov123</span>
        <Icon name="ChevronRight" size={13} />
        <span className="text-foreground">{crumb}</span>
      </nav>

      <div className="flex items-center gap-2">
      <a
        href="/download"
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Icon name="Download" size={14} />
        <span className="hidden sm:inline">Скачать приложение</span>
      </a>
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
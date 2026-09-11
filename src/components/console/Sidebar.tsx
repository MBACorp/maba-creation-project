import { ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { navItems, SectionId } from '@/data/console';
import UpdateCard from '@/components/console/UpdateCard';
import { cn } from '@/lib/utils';

interface SidebarProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  onAdd: () => void;
  used: number;
  limit: number;
  open: boolean;
  onClose: () => void;
  folderSlot?: ReactNode;
}

const Sidebar = ({
  active,
  onSelect,
  onAdd,
  used,
  limit,
  open,
  onClose,
  folderSlot,
}: SidebarProps) => {
  const percent = Math.round((used / limit) * 100);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col gap-5 border-r border-border bg-card px-4 py-5 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex animate-fade-up items-center gap-3 px-1.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-head text-[13px] font-extrabold tracking-tight text-primary-foreground">
            M
          </div>
          <div className="min-w-0">
            <div className="font-head text-[17px] font-extrabold leading-none tracking-tight text-foreground">
              MBA
            </div>
            <div className="truncate text-[11px] text-muted-foreground">aleksandrgricov123</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Закрыть меню"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <button
          onClick={onAdd}
          className="flex w-full animate-fade-up items-center justify-between rounded-lg bg-primary px-4 py-3 font-head text-[14px] font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90 [animation-delay:40ms]"
        >
          <span className="flex items-center gap-2">
            <Icon name="Plus" size={16} />
            Добавить профиль
          </span>
          <span className="text-[12px] opacity-60">⌘N</span>
        </button>

        <nav className="animate-fade-up [animation-delay:80ms]">
          <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Рабочее место
          </div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[14px] font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                    )}
                  >
                    <Icon
                      name={item.icon}
                      size={16}
                      className={isActive ? 'text-primary' : 'text-dot'}
                    />
                    {item.label}
                    {item.meta && (
                      <span className="ml-auto text-[12px] text-muted-foreground">{item.meta}</span>
                    )}
                    {item.tag && (
                      <span className="ml-auto rounded border border-primary/40 px-1.5 py-px text-[9px] uppercase tracking-[0.1em] text-primary">
                        {item.tag}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {active === 'profiles' && folderSlot && (
          <div className="min-h-[120px] flex-1 overflow-y-auto scroll-thin">{folderSlot}</div>
        )}

        <div className="shrink-0 space-y-3">
          <a
            href="/mba-antidetect.zip"
            download
            className="flex animate-fade-up items-center gap-2.5 rounded-lg border border-primary/30 px-3 py-2.5 transition-colors hover:bg-primary/5 [animation-delay:120ms]"
          >
            <Icon name="MonitorDown" fallback="Download" size={15} className="shrink-0 text-primary" />
            <p className="font-head text-[13px] font-bold leading-snug text-foreground">
              Приложение для ПК
            </p>
          </a>

          <UpdateCard />

          <div className="animate-fade-up rounded-lg border border-border p-3.5 [animation-delay:160ms]">
            <div className="flex items-baseline justify-between">
              <span className="font-head text-[14px] font-bold text-foreground">Professional</span>
              <button className="text-[12px] text-muted-foreground transition-colors hover:text-primary">
                Сменить
              </button>
            </div>
            <div className="my-3 h-[3px] rounded-sm bg-border">
              <i
                className="block h-full rounded-sm bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-[12px] text-muted-foreground">
              {used} из {limit} профилей
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
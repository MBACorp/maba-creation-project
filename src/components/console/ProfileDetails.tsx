import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Profile, STATUS_LABEL } from '@/data/console';
import Icon from '@/components/ui/icon';

interface ProfileDetailsProps {
  profile: Profile | null;
  onOpenChange: (v: boolean) => void;
  onToggle: (id: string) => void;
}

const ProfileDetails = ({ profile, onOpenChange, onToggle }: ProfileDetailsProps) => {
  return (
    <Sheet open={!!profile} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-border bg-card sm:max-w-md">
        {profile && (
          <>
            <SheetHeader>
              <SheetTitle className="font-head text-[19px] font-extrabold tracking-tight text-foreground">
                {profile.name}
              </SheetTitle>
            </SheetHeader>

            <dl className="mt-6 space-y-4 text-[14px]">
              {[
                { k: 'Состояние', v: STATUS_LABEL[profile.status] },
                { k: 'Заметка', v: profile.note },
                {
                  k: 'Тип прокси',
                  v: profile.proxyType === '—' ? 'без прокси' : `${profile.proxyType} · ${profile.country}`,
                },
                { k: 'IP-адрес', v: `${profile.flag} ${profile.ip}`.trim() },
                { k: 'Последний запуск', v: profile.lastRun },
              ].map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-4 border-b border-line-soft pb-3">
                  <dt className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                    {row.k}
                  </dt>
                  <dd className="tabular text-right text-foreground">{row.v}</dd>
                </div>
              ))}
            </dl>

            {profile.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border px-2 py-1 text-[12px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onToggle(profile.id)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-head text-[14px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Icon name={profile.status === 'running' ? 'Square' : 'Play'} size={15} />
              {profile.status === 'running' ? 'Остановить профиль' : 'Запустить профиль'}
            </button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDetails;

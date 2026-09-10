import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Profile, STATUS_LABEL } from '@/data/console';
import { FingerprintOverride } from '@/data/fingerprint';
import { ProxyRecord } from '@/data/proxy';
import FingerprintEditor from './FingerprintEditor';
import ProxyPicker from './ProxyPicker';
import Icon from '@/components/ui/icon';

interface ProfileDetailsProps {
  profile: Profile | null;
  proxies: ProxyRecord[];
  onOpenChange: (v: boolean) => void;
  onToggle: (id: string) => void;
  onFingerprint: (id: string, fp: FingerprintOverride) => void;
  onProxy: (id: string, proxyId?: string) => void;
}

const ProfileDetails = ({
  profile,
  proxies,
  onOpenChange,
  onToggle,
  onFingerprint,
  onProxy,
}: ProfileDetailsProps) => {
  return (
    <Sheet open={!!profile} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card scroll-thin sm:max-w-md">
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

            <ProxyPicker
              proxies={proxies}
              value={profile.proxyId}
              onChange={(proxyId) => onProxy(profile.id, proxyId)}
            />

            <FingerprintEditor
              value={profile.fingerprint}
              onSave={(fp) => onFingerprint(profile.id, fp)}
            />

            <button
              onClick={() => onToggle(profile.id)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-head text-[14px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
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
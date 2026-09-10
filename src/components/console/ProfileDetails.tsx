import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Profile, STATUS_LABEL } from '@/data/console';
import { FingerprintOverride } from '@/data/fingerprint';
import { ProxyRecord } from '@/data/proxy';
import { Folder, colorClass } from '@/data/folders';
import FingerprintEditor from './FingerprintEditor';
import ProxyPicker from './ProxyPicker';
import TagEditor from './TagEditor';
import CookieManager from './CookieManager';
import FingerprintAudit from './FingerprintAudit';
import Icon from '@/components/ui/icon';

interface ProfileDetailsProps {
  profile: Profile | null;
  proxies: ProxyRecord[];
  folders: Folder[];
  allTags: string[];
  onOpenChange: (v: boolean) => void;
  onToggle: (id: string) => void;
  onFingerprint: (id: string, fp: FingerprintOverride) => void;
  onProxy: (id: string, proxyId?: string) => void;
  onFolder: (id: string, folderId?: string) => void;
  onTags: (id: string, tags: string[]) => void;
}

const ProfileDetails = ({
  profile,
  proxies,
  folders,
  allTags,
  onOpenChange,
  onToggle,
  onFingerprint,
  onProxy,
  onFolder,
  onTags,
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

            <div className="mt-5 rounded-lg border border-border p-3.5">
              <div className="flex items-center gap-3">
                <Icon name="Folder" size={16} className="shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-head text-[13px] font-bold text-foreground">Папка</p>
                  <p className="flex items-center gap-1.5 truncate text-[12px] text-muted-foreground">
                    {profile.folderId && (
                      <span
                        className={`h-2 w-2 shrink-0 rounded-sm ${colorClass(
                          folders.find((f) => f.id === profile.folderId)?.color,
                        )}`}
                      />
                    )}
                    {folders.find((f) => f.id === profile.folderId)?.name || 'Без папки'}
                  </p>
                </div>
              </div>
              <div className="relative mt-3">
                <select
                  value={profile.folderId || ''}
                  onChange={(e) => onFolder(profile.id, e.target.value || undefined)}
                  className={`w-full appearance-none rounded-lg border bg-secondary px-3 py-2 pr-8 text-[13px] outline-none focus:border-primary/60 ${
                    profile.folderId
                      ? 'border-primary/40 text-foreground'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <option value="">Без папки</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDown"
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <TagEditor
              tags={profile.tags}
              suggestions={allTags}
              onChange={(tags) => onTags(profile.id, tags)}
            />

            <ProxyPicker
              proxies={proxies}
              value={profile.proxyId}
              onChange={(proxyId) => onProxy(profile.id, proxyId)}
            />

            <FingerprintEditor
              value={profile.fingerprint}
              onSave={(fp) => onFingerprint(profile.id, fp)}
            />

            <FingerprintAudit
              key={`audit-${profile.id}`}
              profileId={profile.id}
              running={profile.status === 'running'}
            />

            <CookieManager
              key={profile.id}
              profileId={profile.id}
              profileName={profile.name}
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
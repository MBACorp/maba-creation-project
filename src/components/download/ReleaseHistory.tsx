import Icon from '@/components/ui/icon';
import {
  PLATFORM_META,
  Release,
  countDownload,
  formatDate,
  formatSize,
} from '@/data/releases';

interface ReleaseHistoryProps {
  releases: Release[];
}

const ReleaseHistory = ({ releases }: ReleaseHistoryProps) => {
  if (releases.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-[15px] font-semibold text-foreground">История версий</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Все выпуски приложения. Можно скачать любую предыдущую версию.
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        {releases.map((release, index) => (
          <div
            key={release.id}
            className={`flex flex-wrap items-center gap-3 px-5 py-4 ${
              index > 0 ? 'border-t border-border' : ''
            }`}
          >
            <Icon
              name={PLATFORM_META[release.platform].icon}
              fallback="Monitor"
              size={16}
              className="text-muted-foreground"
            />
            <span className="w-20 text-[14px] font-semibold text-foreground">
              {release.version}
            </span>
            <span className="w-24 text-[13px] text-muted-foreground">
              {PLATFORM_META[release.platform].title}
            </span>
            <span className="hidden w-32 text-[13px] text-muted-foreground sm:block">
              {formatDate(release.createdAt)}
            </span>
            <span className="hidden w-20 text-[13px] text-muted-foreground sm:block">
              {formatSize(release.fileSize)}
            </span>
            <p className="min-w-[120px] flex-1 truncate text-[13px] text-muted-foreground">
              {release.notes || 'Без описания'}
            </p>
            <button
              onClick={() => {
                countDownload(release.id);
                window.location.href = release.fileUrl;
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Icon name="Download" size={13} />
              Скачать
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReleaseHistory;

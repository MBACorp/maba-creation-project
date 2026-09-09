import Icon from '@/components/ui/icon';
import {
  PLATFORM_META,
  Platform,
  Release,
  countDownload,
  formatDate,
  formatSize,
} from '@/data/releases';

interface DownloadCardProps {
  platform: Platform;
  release?: Release;
  recommended?: boolean;
}

const DownloadCard = ({ platform, release, recommended }: DownloadCardProps) => {
  const meta = PLATFORM_META[platform];

  const handleDownload = () => {
    if (!release) return;
    countDownload(release.id);
    window.location.href = release.fileUrl;
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-card p-6 transition-colors ${
        recommended ? 'border-primary/50' : 'border-border hover:border-primary/30'
      }`}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-6 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
          Ваша система
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
          <Icon name={meta.icon} fallback="Monitor" size={22} className="text-primary" />
        </span>
        <div>
          <h3 className="text-[17px] font-semibold text-foreground">{meta.title}</h3>
          <p className="text-[12px] text-muted-foreground">{meta.hint}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Версия</span>
          <span className="font-medium text-foreground">
            {release ? release.version : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Размер</span>
          <span className="text-foreground">
            {release ? formatSize(release.fileSize) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Обновлено</span>
          <span className="text-foreground">
            {release ? formatDate(release.createdAt) : '—'}
          </span>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={!release}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
      >
        <Icon name={release ? 'Download' : 'Clock'} size={16} />
        {release ? `Скачать ${meta.ext}` : 'Скоро'}
      </button>

      {release && release.notes && (
        <p className="mt-4 border-t border-border pt-4 text-[12px] leading-relaxed text-muted-foreground">
          {release.notes}
        </p>
      )}
    </div>
  );
};

export default DownloadCard;

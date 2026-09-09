import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import DownloadCard from '@/components/download/DownloadCard';
import ReleaseHistory from '@/components/download/ReleaseHistory';
import PublishDialog from '@/components/download/PublishDialog';
import {
  RELEASES_URL,
  ReleasesData,
  detectPlatform,
  fetchReleases,
} from '@/data/releases';

const STEPS = [
  {
    icon: 'MousePointerClick',
    title: 'Скачайте установщик',
    text: 'Выберите свою систему — файл начнёт загружаться сразу.',
  },
  {
    icon: 'PackageOpen',
    title: 'Запустите файл',
    text: 'На Windows откройте .exe, на macOS перетащите приложение в «Программы».',
  },
  {
    icon: 'RefreshCw',
    title: 'Обновления сами',
    text: 'Приложение проверяет новые версии при запуске и предлагает обновиться в один клик.',
  },
];

const Download = () => {
  const [data, setData] = useState<ReleasesData>({ releases: [], latest: {} });
  const [loading, setLoading] = useState(true);
  const [publishOpen, setPublishOpen] = useState(false);
  const current = detectPlatform();

  const load = () => {
    setLoading(true);
    fetchReleases()
      .then(setData)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <nav className="hidden items-center gap-2 text-[13px] text-muted-foreground sm:flex">
          <span>MBA</span>
          <Icon name="ChevronRight" size={13} />
          <span className="text-foreground">Скачать приложение</span>
        </nav>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Icon name="LayoutGrid" size={14} />
          <span className="hidden sm:inline">Открыть в браузере</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-14">
        <span className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
          Антидетект-браузер
        </span>
        <h1 className="mt-5 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[52px]">
          Установите MBA<br />на свой компьютер
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Полноценное приложение для Windows и macOS. Профили, прокси и облачные
          устройства — в одном окне, с автоматическим обновлением.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {(['windows', 'macos'] as const).map((platform) => (
            <DownloadCard
              key={platform}
              platform={platform}
              release={data.latest[platform]}
              recommended={platform === current}
            />
          ))}
        </div>

        {loading && (
          <p className="mt-5 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Icon name="Loader" size={14} className="animate-spin" />
            Загружаю актуальные версии…
          </p>
        )}

        {!loading && data.releases.length === 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Установщики ещё не загружены. Как только вы опубликуете первую версию,
              кнопки скачивания заработают автоматически — страницу менять не нужно.
            </p>
          </div>
        )}

        <section className="mt-14 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-5">
              <Icon name={step.icon} fallback="Circle" size={18} className="text-primary" />
              <h3 className="mt-3 text-[14px] font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </section>

        <ReleaseHistory releases={data.releases} />

        <section className="mt-14 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">
                Публикация обновлений
              </h2>
              <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
                Загрузите новый установщик — он сразу появится на этой странице, а у
                установленных приложений проверка обновлений увидит свежую версию.
              </p>
            </div>
            <button
              onClick={() => setPublishOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Icon name="Upload" size={15} />
              Загрузить версию
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-border bg-secondary p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Адрес проверки обновлений
            </p>
            <code className="mt-2 block break-all text-[12px] text-foreground">
              {RELEASES_URL}
            </code>
          </div>
        </section>
      </main>

      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublished={load}
      />
    </div>
  );
};

export default Download;

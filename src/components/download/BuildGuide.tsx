import { useState } from 'react';
import Icon from '@/components/ui/icon';

const TABS = [
  {
    id: 'github',
    title: 'Через GitHub',
    badge: 'Ничего ставить не надо',
    steps: [
      'Скачайте архив с приложением кнопкой выше и распакуйте его.',
      'Создайте на github.com новый репозиторий (можно приватный).',
      'Загрузите туда содержимое папки: Add file → Upload files, перетащите все файлы и папки.',
      'Откройте вкладку Actions → «Сборка установщиков MBA» → Run workflow.',
      'Через 8–12 минут внизу страницы, в разделе Artifacts, появятся готовые .exe и .dmg.',
    ],
    note: 'Сборка идёт на серверах GitHub сразу под обе системы — свой компьютер не нужен, всё бесплатно.',
  },
  {
    id: 'local',
    title: 'На своём компьютере',
    badge: 'Нужен Node.js',
    steps: [
      'Скачайте архив кнопкой выше и распакуйте его.',
      'Установите Node.js 20 с nodejs.org, если его ещё нет.',
      'В папке приложения выполните npm install.',
      'npm run build:win на Windows или npm run build:mac на Mac.',
      'Готовые установщики появятся в папке dist.',
    ],
    note: 'Файл .exe собирается только на Windows, .dmg — только на Mac. Поэтому вариант с GitHub чаще удобнее.',
  },
];

const BuildGuide = () => {
  const [active, setActive] = useState('github');
  const tab = TABS.find((t) => t.id === active) || TABS[0];

  return (
    <section className="mt-14 rounded-xl border border-border bg-card p-6">
      <h2 className="text-[15px] font-semibold text-foreground">
        Как собрать установщики
      </h2>
      <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
        Приложение уже готово: интерфейс консоли зашит внутрь, программа работает
        без интернета и сама проверяет обновления. Осталось собрать из него файлы
        установки для Windows и macOS.
      </p>

      <a
        href="/mba-desktop-source.zip"
        download
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Icon name="FileArchive" fallback="Download" size={15} />
        Скачать приложение для сборки
      </a>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
              active === item.id
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-secondary p-5">
        <span className="inline-flex rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
          {tab.badge}
        </span>
        <ol className="mt-4 space-y-3">
          {tab.steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 text-[13px] leading-relaxed text-foreground"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-[12px] leading-relaxed text-muted-foreground">
          <Icon name="Info" size={14} className="mt-0.5 shrink-0 text-primary" />
          {tab.note}
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border p-4 text-[12px] leading-relaxed text-muted-foreground">
        <Icon name="ShieldCheck" size={14} className="mt-0.5 shrink-0 text-primary" />
        Без сертификата разработчика Windows покажет предупреждение SmartScreen, а macOS —
        «приложение от неизвестного разработчика». Для первых версий это нормально,
        сертификаты можно добавить позже.
      </div>
    </section>
  );
};

export default BuildGuide;

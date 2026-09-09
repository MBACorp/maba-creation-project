import Icon from '@/components/ui/icon';

const devices = [
  { name: 'Pixel 7 · Android 13', region: 'Германия', flag: '🇩🇪', state: 'готов' },
  { name: 'Galaxy S22 · Android 14', region: 'США', flag: '🇺🇸', state: 'создаётся' },
];

const AndroidPanel = () => {
  return (
    <div className="px-5 py-6 md:px-8">
      <div className="animate-fade-up rounded-lg border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info/15 text-info">
            <Icon name="Smartphone" size={20} />
          </div>
          <div>
            <h2 className="font-head text-[18px] font-extrabold tracking-tight text-foreground">
              Cloud Android профили
            </h2>
            <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
              Запускайте собственное Android-устройство в облаке для реальных рабочих процессов с
              приложениями: свой отпечаток, свой прокси, никаких эмуляторов на вашем компьютере.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {devices.map((d, i) => (
          <div
            key={d.name}
            style={{ animationDelay: `${40 + i * 40}ms` }}
            className="flex animate-fade-up items-center justify-between rounded-lg border border-border p-4"
          >
            <div>
              <div className="font-head text-[15px] font-bold tracking-tight text-foreground">
                {d.name}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
                <span>{d.flag}</span>
                {d.region} · {d.state}
              </div>
            </div>
            <button className="rounded-md border border-primary/55 px-3 py-1.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/10">
              Открыть
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AndroidPanel;

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  AUTO,
  CORES_OPTIONS,
  DEVICE_SPECS,
  FingerprintOverride,
  GPU_OPTIONS,
  LOCALE_OPTIONS,
  MEMORY_OPTIONS,
  OS_OPTIONS,
  SCREEN_OPTIONS,
  TIMEZONE_OPTIONS,
  specOptions,
} from '@/data/fingerprint';

interface FingerprintEditorProps {
  value?: FingerprintOverride;
  onSave: (fp: FingerprintOverride) => void;
}

type Draft = Record<string, string>;

const toDraft = (fp?: FingerprintOverride): Draft => ({
  os: fp?.os || AUTO,
  screen: fp?.screen || AUTO,
  gpu: fp?.gpu || AUTO,
  timezone: fp?.timezone || AUTO,
  locale: fp?.locale || AUTO,
  hardwareConcurrency: fp?.hardwareConcurrency ? String(fp.hardwareConcurrency) : AUTO,
  deviceMemory: fp?.deviceMemory ? String(fp.deviceMemory) : AUTO,
});

const Field = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      {label}
    </span>
    <div className="relative mt-1.5">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border bg-secondary px-3 py-2 pr-8 text-[13px] outline-none transition-colors focus:border-primary/60 ${
          value === AUTO
            ? 'border-border text-muted-foreground'
            : 'border-primary/40 text-foreground'
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="ChevronDown"
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  </label>
);

const FingerprintEditor = ({ value, onSave }: FingerprintEditorProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(toDraft(value));

  useEffect(() => setDraft(toDraft(value)), [value]);

  const set = (key: string, v: string) =>
    setDraft((prev) => {
      const next = { ...prev, [key]: v };

      /* Смена системы — сбрасываем всё, что к ней не подходит */
      if (key === 'os' && v !== AUTO) {
        const gpu = GPU_OPTIONS.find((g) => g.value === prev.gpu);
        if (gpu && gpu.os !== 'any' && gpu.os !== v) next.gpu = AUTO;
        const screen = SCREEN_OPTIONS.find((s) => s.value === prev.screen);
        if (screen && screen.os !== 'any' && screen.os !== v) next.screen = AUTO;
      }

      /* Смена машины — подтягиваем систему и сбрасываем невозможное железо */
      if (key === 'gpu' && v !== AUTO) {
        const gpu = GPU_OPTIONS.find((g) => g.value === v);
        if (gpu && gpu.os !== 'any') {
          next.os = gpu.os;
          const screen = SCREEN_OPTIONS.find((s) => s.value === prev.screen);
          if (screen && screen.os !== 'any' && screen.os !== gpu.os) next.screen = AUTO;
        }
        const spec = DEVICE_SPECS[v];
        if (spec) {
          if (!spec.cores.map(String).includes(prev.hardwareConcurrency))
            next.hardwareConcurrency = AUTO;
          if (!spec.memory.map(String).includes(prev.deviceMemory)) next.deviceMemory = AUTO;
        }
      }

      return next;
    });

  const gpuOptions = GPU_OPTIONS.filter(
    (g) => draft.os === AUTO || g.os === 'any' || g.os === draft.os,
  );

  const screenOptions = SCREEN_OPTIONS.filter(
    (s) => draft.os === AUTO || s.os === 'any' || s.os === draft.os,
  );

  const coresOptions = specOptions(CORES_OPTIONS, draft.gpu, 'cores');
  const memoryOptions = specOptions(MEMORY_OPTIONS, draft.gpu, 'memory');
  const deviceLabel = GPU_OPTIONS.find((g) => g.value === draft.gpu && g.value !== AUTO)?.label;

  const changed = Object.values(draft).filter((v) => v !== AUTO).length;
  const geoAuto = Boolean(
    value?.geoAuto &&
      draft.timezone === (value.timezone || AUTO) &&
      draft.locale === (value.locale || AUTO),
  );

  const save = () => {
    const fp: FingerprintOverride = {};
    const geoUntouched =
      value?.geoAuto &&
      draft.timezone === (value.timezone || AUTO) &&
      draft.locale === (value.locale || AUTO);
    if (geoUntouched) fp.geoAuto = true;
    if (draft.os !== AUTO) fp.os = draft.os as 'win' | 'mac';
    if (draft.screen !== AUTO) fp.screen = draft.screen;
    if (draft.gpu !== AUTO) fp.gpu = draft.gpu;
    if (draft.timezone !== AUTO) fp.timezone = draft.timezone;
    if (draft.locale !== AUTO) fp.locale = draft.locale;
    if (draft.hardwareConcurrency !== AUTO)
      fp.hardwareConcurrency = Number(draft.hardwareConcurrency);
    if (draft.deviceMemory !== AUTO) fp.deviceMemory = Number(draft.deviceMemory);
    onSave(fp);
  };

  const reset = () => {
    setDraft(toDraft(undefined));
    onSave({});
  };

  return (
    <div className="mt-5 rounded-lg border border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <Icon name="Fingerprint" size={16} className="shrink-0 text-primary" />
        <span className="flex-1">
          <span className="block font-head text-[13px] font-bold text-foreground">
            Отпечаток браузера
          </span>
          <span className="block text-[12px] text-muted-foreground">
            {geoAuto
              ? `Подстроен под прокси${changed > 2 ? `, вручную: ${changed - 2}` : ''}`
              : changed
                ? `${changed} значений задано вручную`
                : 'Всё определяется автоматически'}
          </span>
        </span>
        <Icon
          name={open ? 'ChevronUp' : 'ChevronDown'}
          size={15}
          className="shrink-0 text-muted-foreground"
        />
      </button>

      {open && (
        <div className="border-t border-border p-3.5">
          <div className="space-y-3.5">
            <Field label="Система" value={draft.os} options={OS_OPTIONS} onChange={(v) => set('os', v)} />
            <Field
              label="Устройство и видеокарта"
              value={draft.gpu}
              options={gpuOptions}
              onChange={(v) => set('gpu', v)}
            />
            {deviceLabel && (
              <p className="-mt-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                <Icon name="Cpu" size={12} className="mt-0.5 shrink-0 text-primary" />
                Экран, память и шрифты подбираются как у этой модели
              </p>
            )}
            <Field
              label="Разрешение экрана"
              value={draft.screen}
              options={screenOptions}
              onChange={(v) => set('screen', v)}
            />
            <div className={geoAuto ? 'rounded-lg border border-primary/25 bg-primary/5 p-3' : undefined}>
              {geoAuto && (
                <p className="mb-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-primary">
                  <Icon name="Wand2" fallback="Sparkles" size={12} className="mt-0.5 shrink-0" />
                  Подобрано автоматически по стране прокси. Измените — значения станут ручными.
                </p>
              )}
              <div className="space-y-3.5">
                <Field
                  label="Часовой пояс"
                  value={draft.timezone}
                  options={TIMEZONE_OPTIONS}
                  onChange={(v) => set('timezone', v)}
                />
                <Field
                  label="Язык"
                  value={draft.locale}
                  options={LOCALE_OPTIONS}
                  onChange={(v) => set('locale', v)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Процессор"
                value={draft.hardwareConcurrency}
                options={coresOptions}
                onChange={(v) => set('hardwareConcurrency', v)}
              />
              <Field
                label="Память"
                value={draft.deviceMemory}
                options={memoryOptions}
                onChange={(v) => set('deviceMemory', v)}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={save}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 font-head text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Icon name="Check" size={14} />
              Сохранить отпечаток
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-border px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              title="Вернуть автоматические значения"
            >
              <Icon name="RotateCcw" size={14} />
            </button>
          </div>

          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Icon name="Info" size={12} className="mt-0.5 shrink-0 text-primary" />
            Отпечаток собирается комплектом реального устройства — несовместимые
            сочетания недоступны. Пустые поля подбираются автоматически и остаются
            постоянными для профиля.
          </p>
        </div>
      )}
    </div>
  );
};

export default FingerprintEditor;
import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const prompts = [
  'Сколько профилей сейчас запущено?',
  'Подбери прокси для профиля Avito',
  'Как разогреть новый профиль под рекламу?',
];

const answer = (q: string) => {
  const t = q.toLowerCase();
  if (t.includes('запущен') || t.includes('сколько'))
    return 'Сейчас запущен 1 профиль — Denver card/america на socks5 · US 46.17.43.24. Остальные готовы к старту.';
  if (t.includes('прокси'))
    return 'Для профиля Avito подойдёт резидентный socks5 в RU. В разделе Прокси есть свободный слот — привяжу его при старте профиля.';
  if (t.includes('разогре') || t.includes('реклам'))
    return 'План разогрева: 3 дня по 20–30 минут обычного сёрфинга, вход в почту, затем первая рекламная сессия. Прокси менять нельзя.';
  return 'Понял задачу. Открою нужный профиль и подготовлю окружение — уточните, с каким сайтом работаем.';
};

const AiPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Я помогаю с профилями, прокси и антидетект-настройками. Спросите что-нибудь.' },
  ]);
  const [value, setValue] = useState('');

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: 'user', text: q }, { role: 'bot', text: answer(q) }]);
    setValue('');
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-5 py-6 md:px-8">
      <div className="flex-1 space-y-3 overflow-y-auto scroll-thin pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-fade-up gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
          >
            {m.role === 'bot' && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ai/15 text-ai">
                <Icon name="Sparkles" size={15} />
              </div>
            )}
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[80%] rounded-lg bg-primary px-3.5 py-2.5 text-[14px] text-primary-foreground'
                  : 'max-w-[80%] rounded-lg border border-border bg-card px-3.5 py-2.5 text-[14px] leading-relaxed text-foreground'
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(value);
        }}
        className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 focus-within:border-primary/50"
      >
        <Icon name="MessageSquare" size={15} className="text-dot" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Спросите про профили и прокси"
          className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Отправить
        </button>
      </form>
    </div>
  );
};

export default AiPanel;

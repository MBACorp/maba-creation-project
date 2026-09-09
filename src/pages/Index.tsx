import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import TopBar from '@/components/console/TopBar';
import Sidebar from '@/components/console/Sidebar';
import Toolbar, { FilterId } from '@/components/console/Toolbar';
import ProfileTable from '@/components/console/ProfileTable';
import ProxyPanel from '@/components/console/ProxyPanel';
import AiPanel from '@/components/console/AiPanel';
import ApiPanel from '@/components/console/ApiPanel';
import AndroidPanel from '@/components/console/AndroidPanel';
import AddProfileDialog from '@/components/console/AddProfileDialog';
import ProfileDetails from '@/components/console/ProfileDetails';
import { Profile, SectionId, profilesSeed } from '@/data/console';

const SECTION_META: Record<SectionId, { eyebrow: string; title: string }> = {
  profiles: { eyebrow: 'Профили браузера', title: 'Все профили' },
  proxy: { eyebrow: 'Сеть', title: 'Прокси' },
  ai: { eyebrow: 'Помощник', title: 'AI Ассистент' },
  api: { eyebrow: 'Интеграции', title: 'API & MCP' },
  android: { eyebrow: 'Облако', title: 'Cloud Android' },
};

const LIMIT = 10;

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>(profilesSeed);
  const [section, setSection] = useState<SectionId>('profiles');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [details, setDetails] = useState<Profile | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchQuery =
        !q || p.name.toLowerCase().includes(q) || p.ip.toLowerCase().includes(q);
      const matchFilter =
        filter === 'all' ||
        (filter === 'ready' && p.status !== 'running') ||
        (filter === 'running' && p.status === 'running') ||
        (filter === 'noproxy' && p.proxyType === '—');
      return matchQuery && matchFilter;
    });
  }, [profiles, query, filter]);

  const runningCount = profiles.filter((p) => p.status === 'running').length;

  const toggleProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next: Profile =
          p.status === 'running'
            ? { ...p, status: 'ready', lastRun: 'только что' }
            : { ...p, status: 'running', lastRun: 'сейчас' };
        toast(next.status === 'running' ? `Профиль «${p.name}» запущен` : `Профиль «${p.name}» остановлен`);
        return next;
      }),
    );
    setDetails((d) =>
      d && d.id === id
        ? { ...d, status: d.status === 'running' ? 'ready' : 'running' }
        : d,
    );
  };

  const createProfile = (data: Omit<Profile, 'id'>) => {
    if (profiles.length >= LIMIT) {
      toast('Достигнут лимит тарифа Professional');
      return;
    }
    setProfiles((prev) => [...prev, { ...data, id: `p${Date.now()}` }]);
    toast(`Профиль «${data.name}» создан`);
  };

  const meta = SECTION_META[section];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar crumb={meta.title} onInvite={() => toast('Ссылка-приглашение скопирована')} />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          active={section}
          onSelect={(id) => {
            setSection(id);
            setMenuOpen(false);
          }}
          onAdd={() => {
            setAddOpen(true);
            setMenuOpen(false);
          }}
          used={profiles.length}
          limit={LIMIT}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <Toolbar
            eyebrow={meta.eyebrow}
            title={meta.title}
            query={query}
            onQuery={setQuery}
            filter={filter}
            onFilter={setFilter}
            onBurger={() => setMenuOpen(true)}
            showFilters={section === 'profiles'}
          />

          <div className="min-h-0 flex-1 overflow-auto scroll-thin">
            {section === 'profiles' && (
              <ProfileTable
                profiles={visible}
                total={profiles.length}
                runningCount={runningCount}
                onToggle={toggleProfile}
                onOpen={setDetails}
                onReset={() => {
                  setQuery('');
                  setFilter('all');
                }}
              />
            )}
            {section === 'proxy' && <ProxyPanel />}
            {section === 'ai' && <AiPanel />}
            {section === 'api' && <ApiPanel />}
            {section === 'android' && <AndroidPanel />}
          </div>
        </main>
      </div>

      <AddProfileDialog open={addOpen} onOpenChange={setAddOpen} onCreate={createProfile} />
      <ProfileDetails
        profile={details}
        onOpenChange={(v) => !v && setDetails(null)}
        onToggle={toggleProfile}
      />
    </div>
  );
};

export default Index;

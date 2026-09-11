import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import TopBar from '@/components/console/TopBar';
import BulkBar from '@/components/console/BulkBar';
import Sidebar from '@/components/console/Sidebar';
import Toolbar, { FilterId } from '@/components/console/Toolbar';
import ProfileTable from '@/components/console/ProfileTable';
import ProxyPanel from '@/components/console/ProxyPanel';
import AiPanel from '@/components/console/AiPanel';
import ApiPanel from '@/components/console/ApiPanel';
import AndroidPanel from '@/components/console/AndroidPanel';
import AddProfileDialog from '@/components/console/AddProfileDialog';
import ProfileDetails from '@/components/console/ProfileDetails';
import { Profile, SectionId } from '@/data/console';
import { useProfiles } from '@/hooks/useProfiles';
import { useProxies } from '@/hooks/useProxies';
import { useFolders } from '@/hooks/useFolders';
import { ProxyRecord } from '@/data/proxy';
import { ALL_FOLDER, NO_FOLDER } from '@/data/folders';
import FolderList from '@/components/console/FolderList';

const SECTION_META: Record<SectionId, { eyebrow: string; title: string }> = {
  profiles: { eyebrow: 'Профили браузера', title: 'Все профили' },
  proxy: { eyebrow: 'Сеть', title: 'Прокси' },
  ai: { eyebrow: 'Помощник', title: 'AI Ассистент' },
  api: { eyebrow: 'Интеграции', title: 'API & MCP' },
  android: { eyebrow: 'Облако', title: 'Cloud Android' },
};

const LIMIT = 10;

const Index = () => {
  const [picked, setPicked] = useState<string[]>([]);
  const syncGeoRef = useRef<((list: ProxyRecord[]) => void) | null>(null);
  const handleChecked = useCallback((list: ProxyRecord[]) => {
    syncGeoRef.current?.(list);
  }, []);

  const {
    proxies,
    checking,
    addProxies,
    deleteProxy,
    runCheck,
    checkAll,
  } = useProxies(handleChecked);
  const {
    profiles,
    busy,
    bulk,
    desktop,
    toggleProfile,
    startMany,
    createProfile,
    setFingerprint,
    setProxy,
    syncGeo,
    moveToFolder,
    setTags,
    setLabel,
    addNote,
    deleteNote,
  } = useProfiles(LIMIT, proxies);

  syncGeoRef.current = syncGeo;

  const { folders, createFolder, renameFolder, recolorFolder, deleteFolder } =
    useFolders();
  const [section, setSection] = useState<SectionId>('profiles');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [details, setDetails] = useState<Profile | null>(null);
  const [folder, setFolder] = useState<string>(ALL_FOLDER);
  const [tag, setTag] = useState<string | undefined>();
  const [label, setLabelFilter] = useState<string | undefined>();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.ip.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchFilter =
        filter === 'all' ||
        (filter === 'ready' && p.status !== 'running') ||
        (filter === 'running' && p.status === 'running') ||
        (filter === 'noproxy' && p.proxyType === '—');
      const matchFolder =
        folder === ALL_FOLDER ||
        (folder === NO_FOLDER ? !p.folderId : p.folderId === folder);
      const matchTag = !tag || p.tags.includes(tag);
      const matchLabel = !label || p.labelId === label;
      return matchQuery && matchFilter && matchFolder && matchTag && matchLabel;
    });
  }, [profiles, query, filter, folder, tag, label]);

  const labelCounts = useMemo(() => {
    const map: Record<string, number> = {};
    profiles.forEach((p) => {
      if (p.labelId) map[p.labelId] = (map[p.labelId] || 0) + 1;
    });
    return map;
  }, [profiles]);

  const folderCounts = useMemo(() => {
    const map: Record<string, number> = {
      [ALL_FOLDER]: profiles.length,
      [NO_FOLDER]: profiles.filter((p) => !p.folderId).length,
    };
    folders.forEach((f) => {
      map[f.id] = profiles.filter((p) => p.folderId === f.id).length;
    });
    return map;
  }, [profiles, folders]);

  const allTags = useMemo(() => {
    const counter = new Map<string, number>();
    profiles.forEach((p) =>
      p.tags.forEach((t) => counter.set(t, (counter.get(t) || 0) + 1)),
    );
    return [...counter.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [profiles]);

  const runningCount = profiles.filter((p) => p.status === 'running').length;
  const folderName =
    folder === ALL_FOLDER
      ? undefined
      : folder === NO_FOLDER
        ? 'Без папки'
        : folders.find((f) => f.id === folder)?.name;

  const meta = SECTION_META[section];
  const activeDetails = details
    ? profiles.find((p) => p.id === details.id) || details
    : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar
        crumb={meta.title}
        desktop={desktop}
        onInvite={() => toast('Ссылка-приглашение скопирована')}
      />

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
          folderSlot={
            <FolderList
              folders={folders}
              counts={folderCounts}
              active={folder}
              onSelect={setFolder}
              onCreate={(name) => createFolder(name)}
              onRename={renameFolder}
              onRecolor={recolorFolder}
              onDelete={(id) => {
                deleteFolder(id);
                if (folder === id) setFolder(ALL_FOLDER);
              }}
              onDropProfiles={moveToFolder}
            />
          }
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
            tags={allTags}
            activeTag={tag}
            onTag={setTag}
            labelCounts={labelCounts}
            activeLabel={label}
            onLabel={setLabelFilter}
          />

          <div className="min-h-0 flex-1 overflow-auto scroll-thin">
            {section === 'profiles' && (
              <ProfileTable
                profiles={visible}
                total={profiles.length}
                runningCount={runningCount}
                busyId={busy}
                folderName={folderName}
                activeTag={tag}
                onToggle={toggleProfile}
                onOpen={setDetails}
                onTagClick={(t) => setTag(tag === t ? undefined : t)}
                onLabel={setLabel}
                selected={picked}
                onSelect={(id) =>
                  setPicked((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  )
                }
                onSelectAll={() =>
                  setPicked((prev) =>
                    visible.length > 0 && visible.every((p) => prev.includes(p.id))
                      ? []
                      : visible.map((p) => p.id),
                  )
                }
                onReset={() => {
                  setQuery('');
                  setFilter('all');
                  setFolder(ALL_FOLDER);
                  setTag(undefined);
                  setLabelFilter(undefined);
                }}
              />
            )}
            {section === 'proxy' && (
              <ProxyPanel
                proxies={proxies}
                profiles={profiles}
                checking={checking}
                onAdd={addProxies}
                onCheck={runCheck}
                onCheckAll={checkAll}
                onDelete={deleteProxy}
              />
            )}
            {section === 'ai' && <AiPanel />}
            {section === 'api' && <ApiPanel />}
            {section === 'android' && <AndroidPanel />}
          </div>
        </main>
      </div>

      <AddProfileDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={createProfile}
        proxies={proxies}
        folders={folders}
        defaultFolder={
          folder !== ALL_FOLDER && folder !== NO_FOLDER ? folder : undefined
        }
      />
      <BulkBar
        count={picked.length}
        progress={bulk}
        onStart={() => startMany(picked)}
        onClear={() => setPicked([])}
      />

      <ProfileDetails
        profile={activeDetails}
        proxies={proxies}
        onOpenChange={(v) => !v && setDetails(null)}
        onToggle={toggleProfile}
        onFingerprint={setFingerprint}
        onProxy={(id, proxyId) =>
          setProxy(id, proxyId ? proxies.find((p) => p.id === proxyId) : undefined)
        }
        folders={folders}
        allTags={allTags}
        onFolder={(id, folderId) =>
          moveToFolder([id], folderId, folders.find((f) => f.id === folderId)?.name)
        }
        onTags={setTags}
        onLabel={setLabel}
        onAddNote={addNote}
        onDeleteNote={deleteNote}
      />
    </div>
  );
};

export default Index;
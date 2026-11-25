import { Note, Folder, Tag, DesktopSettings, BackupData } from '../types';

const DB_NAME = 'PixelNotesDB';
const DB_VERSION = 1;
const STORAGE_BACKUP_KEY = 'pixel_notes_storage_v1';

export const DEFAULT_SETTINGS: DesktopSettings = {
  viewMode: 'today',
  wallpaper: 'teal',
  folderIconSize: 'md',
  soundEnabled: true,
  crtScanline: false,
  gridSnap: true,
};

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder-work',
    name: '工作计划',
    icon: 'folder-work',
    color: '#fbbf24', // amber
    position: { x: 30, y: 110 },
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'folder-life',
    name: '生活日常',
    icon: 'folder-life',
    color: '#34d399', // emerald
    position: { x: 30, y: 220 },
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'folder-study',
    name: '灵感学习',
    icon: 'folder-study',
    color: '#60a5fa', // sky
    position: { x: 30, y: 330 },
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'folder-archive',
    name: '历史收纳',
    icon: 'folder-archive',
    color: '#a78bfa', // purple
    position: { x: 30, y: 440 },
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-urgent', name: '紧急', color: '#ef4444' },
  { id: 'tag-todo', name: '待办', color: '#f59e0b' },
  { id: 'tag-idea', name: '灵感', color: '#10b981' },
  { id: 'tag-private', name: '私密', color: '#8b5cf6' },
  { id: 'tag-reading', name: '书影', color: '#06b6d4' },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-welcome',
    title: '★ 欢迎来到像素桌面便签！',
    content: '- [x] 纯前端无后端运行\n- [x] 本地数据实时自动保存\n- [ ] 尝试拖拽桌面便签与文件夹\n- [ ] 体验四种核心视图切换\n- [ ] 点击顶部按钮或快捷键新建便签',
    color: 'yellow',
    folderId: 'folder-work',
    tagIds: ['tag-urgent', 'tag-todo'],
    isPinned: true,
    isStarred: true,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago today
    updatedAt: Date.now() - 1000 * 60 * 10,
    position: { x: 180, y: 110 },
    zIndex: 10,
  },
  {
    id: 'note-today-groceries',
    title: '今日备忘清单',
    content: '- [ ] 购买摩卡咖啡豆与鲜牛奶\n- [ ] 整理复古像素壁纸素材\n- [ ] 备份工作文档到本地磁盘\n> 像素提示：今天创建的便签默认常驻桌面，不怕归档遗漏！',
    color: 'green',
    folderId: 'folder-life',
    tagIds: ['tag-todo'],
    isPinned: false,
    isStarred: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 90, // 1.5 hours ago today
    updatedAt: Date.now() - 1000 * 60 * 90,
    position: { x: 470, y: 110 },
    zIndex: 5,
  },
  {
    id: 'note-idea-pixel',
    title: '复古像素设计灵感',
    content: '8-bit拟物桌面要素：\n1. 粗像素投影与高光边框\n2. 实体便签折角效果\n3. 拟物便签纸质暖黄色调\n4. 文件夹收纳与智能红点归档提示',
    color: 'blue',
    texture: 'grid',
    folderId: 'folder-study',
    tagIds: ['tag-idea'],
    isPinned: false,
    isStarred: true,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago today
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    position: { x: 760, y: 110 },
    zIndex: 6,
  },
  {
    id: 'note-history-yesterday',
    title: '昨日会议回顾（待归档演示）',
    content: '复盘了前端本地存储方案：\n- IndexedDB + LocalStorage 双引擎容灾\n- 支持JSON一键导入导出\n- 体验右上方「一键自动归档」按钮，旧便签将自动整理进文件夹！',
    color: 'pink',
    folderId: 'folder-work',
    tagIds: ['tag-idea'],
    isPinned: false,
    isStarred: false,
    isArchived: false, // Intentionally unarchived past note to demonstrate unarchived alert badge!
    isDeleted: false,
    createdAt: Date.now() - 86400000 * 1 - 1000 * 60 * 40, // Yesterday
    updatedAt: Date.now() - 86400000 * 1,
    position: { x: 180, y: 400 },
    zIndex: 4,
  },
  {
    id: 'note-older-archived',
    title: '已归档笔记（测试样例）',
    content: '这是一条三天前已归档的笔记。\n在「当日默认视图」中不会打扰今日工作，\n但在「历史收纳文件夹」、「全局铺满视图」以及「时间轴视图」中随时可以溯源查阅！',
    color: 'beige',
    folderId: 'folder-archive',
    tagIds: ['tag-reading'],
    isPinned: false,
    isStarred: false,
    isArchived: true, // Archived
    isDeleted: false,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    position: { x: 470, y: 400 },
    zIndex: 2,
  },
];

// Open IndexedDB with Promise
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('folders')) {
        db.createObjectStore('folders', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback LocalStorage recovery check
function readLocalStorageBackup(): {
  notes?: Note[];
  folders?: Folder[];
  tags?: Tag[];
  settings?: DesktopSettings;
} {
  try {
    const raw = localStorage.getItem(STORAGE_BACKUP_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('LocalStorage backup read error:', err);
  }
  return {};
}

function writeLocalStorageBackup(data: {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  settings: DesktopSettings;
}) {
  try {
    localStorage.setItem(STORAGE_BACKUP_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage backup write error:', err);
  }
}

// Data sanitize & repair mechanism
export function sanitizeNotes(notes: unknown[]): Note[] {
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((n): n is Record<string, unknown> => typeof n === 'object' && n !== null)
    .map((n) => ({
      id: String(n.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
      title: String(n.title ?? '无标题便签'),
      content: String(n.content ?? ''),
      color: (['yellow', 'green', 'blue', 'pink', 'purple', 'beige', 'dark'].includes(String(n.color))
        ? n.color
        : 'yellow') as Note['color'],
      texture: (['none', 'grid', 'stripes', 'dots', 'checker'].includes(String(n.texture))
        ? n.texture
        : 'none') as Note['texture'],
      folderId: n.folderId ? String(n.folderId) : null,
      tagIds: Array.isArray(n.tagIds) ? n.tagIds.map(String) : [],
      isPinned: Boolean(n.isPinned),
      isStarred: Boolean(n.isStarred),
      isArchived: Boolean(n.isArchived),
      isDeleted: Boolean(n.isDeleted),
      createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
      updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
      position: {
        x: typeof (n.position as { x?: number })?.x === 'number' ? (n.position as { x: number }).x : 100,
        y: typeof (n.position as { y?: number })?.y === 'number' ? (n.position as { y: number }).y : 100,
      },
      zIndex: typeof n.zIndex === 'number' ? n.zIndex : 1,
    }));
}

export function sanitizeFolders(folders: unknown[]): Folder[] {
  if (!Array.isArray(folders) || folders.length === 0) return INITIAL_FOLDERS;
  return folders
    .filter((f): f is Record<string, unknown> => typeof f === 'object' && f !== null)
    .map((f, idx) => ({
      id: String(f.id || `folder-${idx}`),
      name: String(f.name || '新建文件夹'),
      icon: String(f.icon || 'folder-work'),
      color: String(f.color || '#fbbf24'),
      position: {
        x: typeof (f.position as { x?: number })?.x === 'number' ? (f.position as { x: number }).x : 30,
        y: typeof (f.position as { y?: number })?.y === 'number' ? (f.position as { y: number }).y : 110 + idx * 110,
      },
      createdAt: typeof f.createdAt === 'number' ? f.createdAt : Date.now(),
    }));
}

export function sanitizeTags(tags: unknown[]): Tag[] {
  if (!Array.isArray(tags) || tags.length === 0) return INITIAL_TAGS;
  return tags
    .filter((t): t is Record<string, unknown> => typeof t === 'object' && t !== null)
    .map((t, idx) => ({
      id: String(t.id || `tag-${idx}`),
      name: String(t.name || '标签'),
      color: String(t.color || '#f59e0b'),
    }));
}

// Master Load Data
export async function loadInitialAppData(): Promise<{
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  settings: DesktopSettings;
}> {
  try {
    const db = await openDB();
    const transaction = db.transaction(['notes', 'folders', 'tags', 'settings'], 'readonly');

    const getNotes = new Promise<Note[]>((resolve) => {
      const req = transaction.objectStore('notes').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const getFolders = new Promise<Folder[]>((resolve) => {
      const req = transaction.objectStore('folders').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const getTags = new Promise<Tag[]>((resolve) => {
      const req = transaction.objectStore('tags').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const getSettings = new Promise<DesktopSettings | null>((resolve) => {
      const req = transaction.objectStore('settings').get('main_settings');
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    });

    const [rawNotes, rawFolders, rawTags, rawSettings] = await Promise.all([
      getNotes,
      getFolders,
      getTags,
      getSettings,
    ]);

    // If IndexedDB had items, use and sanitize them
    if (rawNotes.length > 0 || rawFolders.length > 0) {
      const finalNotes = sanitizeNotes(rawNotes);
      const finalFolders = sanitizeFolders(rawFolders);
      const finalTags = sanitizeTags(rawTags);
      const finalSettings = { ...DEFAULT_SETTINGS, ...(rawSettings || {}) };

      // Update LocalStorage backup
      writeLocalStorageBackup({
        notes: finalNotes,
        folders: finalFolders,
        tags: finalTags,
        settings: finalSettings,
      });

      return {
        notes: finalNotes,
        folders: finalFolders,
        tags: finalTags,
        settings: finalSettings,
      };
    }
  } catch (err) {
    console.warn('IndexedDB initial load failed, trying LocalStorage fallback:', err);
  }

  // Fallback to LocalStorage
  const lsBackup = readLocalStorageBackup();
  const notes = lsBackup.notes ? sanitizeNotes(lsBackup.notes) : INITIAL_NOTES;
  const folders = lsBackup.folders ? sanitizeFolders(lsBackup.folders) : INITIAL_FOLDERS;
  const tags = lsBackup.tags ? sanitizeTags(lsBackup.tags) : INITIAL_TAGS;
  const settings = lsBackup.settings ? { ...DEFAULT_SETTINGS, ...lsBackup.settings } : DEFAULT_SETTINGS;

  // Persist seed data to both
  saveAppDataAsync(notes, folders, tags, settings);

  return { notes, folders, tags, settings };
}

// Master Save Data (Asynchronous, dual-write)
export async function saveAppDataAsync(
  notes: Note[],
  folders: Folder[],
  tags: Tag[],
  settings: DesktopSettings
): Promise<void> {
  // Always update LocalStorage backup immediately for durability
  writeLocalStorageBackup({ notes, folders, tags, settings });

  try {
    const db = await openDB();
    const transaction = db.transaction(['notes', 'folders', 'tags', 'settings'], 'readwrite');

    // Sync notes
    const noteStore = transaction.objectStore('notes');
    noteStore.clear();
    for (const note of notes) {
      noteStore.put(note);
    }

    // Sync folders
    const folderStore = transaction.objectStore('folders');
    folderStore.clear();
    for (const folder of folders) {
      folderStore.put(folder);
    }

    // Sync tags
    const tagStore = transaction.objectStore('tags');
    tagStore.clear();
    for (const tag of tags) {
      tagStore.put(tag);
    }

    // Sync settings
    const settingsStore = transaction.objectStore('settings');
    settingsStore.put({ key: 'main_settings', value: settings });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }
}

// Clean and Reset all data
export async function clearAllLocalData(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_BACKUP_KEY);
    const db = await openDB();
    const transaction = db.transaction(['notes', 'folders', 'tags', 'settings'], 'readwrite');
    transaction.objectStore('notes').clear();
    transaction.objectStore('folders').clear();
    transaction.objectStore('tags').clear();
    transaction.objectStore('settings').clear();
  } catch (err) {
    console.warn('Failed clearing data:', err);
  }
}

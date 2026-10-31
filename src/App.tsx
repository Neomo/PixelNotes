/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Note,
  Folder,
  Tag,
  DesktopSettings,
  ViewMode,
  BackupData,
} from './types';
import {
  loadInitialAppData,
  saveAppDataAsync,
  clearAllLocalData,
  DEFAULT_SETTINGS,
  INITIAL_NOTES,
  INITIAL_FOLDERS,
  INITIAL_TAGS,
  sanitizeNotes,
  sanitizeFolders,
  sanitizeTags,
} from './utils/storage';
import { isSameDay } from './utils/date';
import { playPixelSound } from './utils/sound';
import { DesktopHeader } from './components/DesktopHeader';
import { DesktopToolbar } from './components/DesktopToolbar';
import { DesktopCanvas } from './components/DesktopCanvas';
import { TimelineView } from './components/TimelineView';
import { RandomNoteView } from './components/RandomNoteView';
import { NoteEditorModal } from './components/NoteEditorModal';
import { FolderWindowModal } from './components/FolderWindowModal';
import { TrashWindowModal } from './components/TrashWindowModal';
import { SettingsModal } from './components/SettingsModal';
import { NewFolderModal } from './components/NewFolderModal';

export default function App() {
  // App state
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [settings, setSettings] = useState<DesktopSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [starFilter, setStarFilter] = useState(false);
  const [pinFilter, setPinFilter] = useState(false);

  // Modal states
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Initial load
  useEffect(() => {
    loadInitialAppData().then((data) => {
      setNotes(data.notes);
      setFolders(data.folders);
      setTags(data.tags);
      setSettings(data.settings);
      setIsLoading(false);
    });
  }, []);

  // Auto-save helper
  const persistChanges = useCallback(
    (
      newNotes: Note[],
      newFolders: Folder[] = folders,
      newTags: Tag[] = tags,
      newSettings: DesktopSettings = settings
    ) => {
      setNotes(newNotes);
      setFolders(newFolders);
      setTags(newTags);
      setSettings(newSettings);
      saveAppDataAsync(newNotes, newFolders, newTags, newSettings);
    },
    [folders, tags, settings]
  );

  // Sound helper wrapper
  const triggerSound = useCallback(
    (type: 'pop' | 'click' | 'trash' | 'chime' | 'archive' | 'open' | 'close' | 'toggle') => {
      playPixelSound(type, settings.soundEnabled);
    },
    [settings.soundEnabled]
  );

  // Unarchived history notes counter:
  // Non-today notes that have a folderId assigned, are not deleted, and are not yet archived
  const unarchivedHistoryNotes = useMemo(() => {
    return notes.filter(
      (n) => !n.isDeleted && n.folderId && !n.isArchived && !isSameDay(n.createdAt)
    );
  }, [notes]);

  // Today active notes count
  const todayActiveCount = useMemo(() => {
    return notes.filter((n) => !n.isDeleted && isSameDay(n.createdAt) && !n.isArchived).length;
  }, [notes]);

  const totalActiveCount = useMemo(() => {
    return notes.filter((n) => !n.isDeleted).length;
  }, [notes]);

  const deletedNotes = useMemo(() => {
    return notes.filter((n) => n.isDeleted);
  }, [notes]);

  // One-click Auto-Archive logic (Spec rule):
  // "点击后将非当日、已设置文件夹属性的所有便签，自动归类存入对应像素文件夹"
  const handleAutoArchive = () => {
    if (unarchivedHistoryNotes.length === 0) {
      showToast('当前没有需要自动归档的历史便签！');
      triggerSound('click');
      return;
    }

    const unarchivedIds = new Set(unarchivedHistoryNotes.map((n) => n.id));
    const updated = notes.map((n) => {
      if (unarchivedIds.has(n.id)) {
        return { ...n, isArchived: true, updatedAt: Date.now() };
      }
      return n;
    });

    persistChanges(updated);
    triggerSound('archive');
    showToast(`✓ 已自动收纳归档 ${unarchivedHistoryNotes.length} 条历史便签进对应文件夹！`);
  };

  // View Switcher with persistence
  const handleSelectView = (view: ViewMode) => {
    triggerSound('click');
    const newSettings = { ...settings, viewMode: view };
    setSettings(newSettings);
    saveAppDataAsync(notes, folders, tags, newSettings);
  };

  // Create new note
  const handleOpenNewNote = (folderIdDefault?: string) => {
    triggerSound('pop');
    // Calculate intelligent desktop offset so new notes don't completely overlap
    const offsetX = 160 + (notes.length % 5) * 40;
    const offsetY = 80 + (notes.length % 4) * 40;

    const newNote: Note = {
      id: `new-${Date.now()}`,
      title: '',
      content: '',
      color: 'yellow',
      folderId: folderIdDefault || null,
      tagIds: [],
      isPinned: false,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: { x: offsetX, y: offsetY },
      zIndex: 20,
    };
    setEditingNote(newNote);
    setIsEditorOpen(true);
  };

  // Save or Update Note
  const handleSaveNote = (updated: Note) => {
    triggerSound('pop');
    const exists = notes.some((n) => n.id === updated.id);
    let nextNotes: Note[];
    if (exists) {
      nextNotes = notes.map((n) => (n.id === updated.id ? updated : n));
    } else {
      nextNotes = [updated, ...notes];
    }
    persistChanges(nextNotes);
    showToast('✓ 便签已自动保存');
  };

  // Soft delete note (Move to Trash)
  const handleDeleteNote = (id: string) => {
    triggerSound('trash');
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isDeleted: true, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
    showToast('便签已移入回收站');
  };

  // Toggle Pin
  const handleTogglePin = (id: string) => {
    triggerSound('chime');
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
  };

  // Toggle Star
  const handleToggleStar = (id: string) => {
    triggerSound('chime');
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isStarred: !n.isStarred, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
  };

  // Toggle Archive
  const handleToggleArchive = (id: string) => {
    triggerSound('archive');
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const newArchived = !target.isArchived;
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isArchived: newArchived, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
    showToast(newArchived ? '便签已收纳归档' : '便签已移出归档，返回桌面');
  };

  // Clone Note
  const handleCloneNote = (note: Note) => {
    triggerSound('pop');
    const cloned: Note = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${note.title} (副本)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: {
        x: (note.position?.x ?? 200) + 30,
        y: (note.position?.y ?? 100) + 30,
      },
      isArchived: false,
      zIndex: 25,
    };
    persistChanges([cloned, ...notes]);
    showToast('✓ 已克隆新便签到桌面');
  };

  // Interactive update of content (e.g. checkbox toggle)
  const handleUpdateNoteContent = (id: string, newContent: string) => {
    triggerSound('click');
    const updated = notes.map((n) =>
      n.id === id ? { ...n, content: newContent, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
  };

  // Update Note Position from dragging
  const handleUpdateNotePosition = (
    id: string,
    pos: { x: number; y: number },
    zIndex: number
  ) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, position: pos, zIndex } : n
    );
    persistChanges(updated);
  };

  // Update Folder Position from dragging
  const handleUpdateFolderPosition = (id: string, pos: { x: number; y: number }) => {
    const updated = folders.map((f) => (f.id === id ? { ...f, position: pos } : f));
    persistChanges(notes, updated);
  };

  // Dropping Note onto a Folder (Manual Archiving by Drag)
  const handleNoteDropOnFolder = (noteId: string, folderId: string) => {
    triggerSound('archive');
    const targetFolder = folders.find((f) => f.id === folderId);
    const updated = notes.map((n) => {
      if (n.id === noteId) {
        return {
          ...n,
          folderId,
          isArchived: true, // Archived into this folder!
          updatedAt: Date.now(),
        };
      }
      return n;
    });
    persistChanges(updated);
    showToast(`✓ 已成功将便签收纳至「${targetFolder?.name || '文件夹'}」！`);
  };

  // Auto-align notes cleanly on the desktop
  const handleAutoAlignNotes = () => {
    triggerSound('pop');
    const startX = 180;
    const startY = 80;
    const colWidth = 280;
    const rowHeight = 260;
    const cols = Math.max(1, Math.floor((window.innerWidth - 220) / colWidth));

    const updated = notes.map((note, idx) => {
      if (note.isDeleted) return note;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      return {
        ...note,
        position: {
          x: startX + col * colWidth,
          y: startY + row * rowHeight,
        },
      };
    });
    persistChanges(updated);
    showToast('✓ 桌面便签已整齐对齐排列');
  };

  // Clear today's notes
  const handleClearTodayNotes = () => {
    if (window.confirm('确定要清空今日的所有便签吗？它们将移入回收站，随时可以恢复。')) {
      triggerSound('trash');
      const updated = notes.map((n) => {
        if (isSameDay(n.createdAt)) {
          return { ...n, isDeleted: true, updatedAt: Date.now() };
        }
        return n;
      });
      persistChanges(updated);
      showToast('今日便签已移入回收站');
    }
  };

  // Restore note from trash
  const handleRestoreNote = (id: string) => {
    triggerSound('pop');
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isDeleted: false, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
    showToast('便签已成功还原');
  };

  const handleRestoreAll = () => {
    triggerSound('pop');
    const updated = notes.map((n) =>
      n.isDeleted ? { ...n, isDeleted: false, updatedAt: Date.now() } : n
    );
    persistChanges(updated);
    showToast('回收站内所有便签已还原');
  };

  const handlePermanentDelete = (id: string) => {
    triggerSound('trash');
    const updated = notes.filter((n) => n.id !== id);
    persistChanges(updated);
  };

  const handleEmptyTrash = () => {
    triggerSound('trash');
    const updated = notes.filter((n) => !n.isDeleted);
    persistChanges(updated);
    showToast('回收站已彻底清空');
  };

  // Create Tag
  const handleCreateTag = (name: string, color: string): Tag => {
    triggerSound('pop');
    const newTag: Tag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      color,
    };
    const updated = [...tags, newTag];
    setTags(updated);
    saveAppDataAsync(notes, folders, updated, settings);
    return newTag;
  };

  // Create Folder
  const handleCreateFolder = (name: string, color: string, icon: string) => {
    triggerSound('pop');
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      icon,
      color,
      position: { x: 30, y: 110 + (folders.length % 5) * 100 },
      createdAt: Date.now(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    saveAppDataAsync(notes, updated, tags, settings);
    showToast(`✓ 已创建桌面文件夹「${name}」`);
  };

  // Update Folder
  const handleUpdateFolder = (updatedFolder: Folder) => {
    const updated = folders.map((f) => (f.id === updatedFolder.id ? updatedFolder : f));
    setFolders(updated);
    saveAppDataAsync(notes, updated, tags, settings);
  };

  // Delete Folder
  const handleDeleteFolder = (folderId: string) => {
    triggerSound('trash');
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    // Unassign notes from this folder
    const updatedNotes = notes.map((n) =>
      n.folderId === folderId ? { ...n, folderId: null, isArchived: false } : n
    );
    persistChanges(updatedNotes, updatedFolders);
    showToast('文件夹已删除，便签保留在桌面');
  };

  // Import Backup
  const handleImportBackup = (backup: BackupData, mode: 'merge' | 'overwrite') => {
    triggerSound('pop');
    if (mode === 'overwrite') {
      const finalNotes = sanitizeNotes(backup.notes);
      const finalFolders = sanitizeFolders(backup.folders);
      const finalTags = sanitizeTags(backup.tags);
      const finalSettings = backup.settings ? { ...DEFAULT_SETTINGS, ...backup.settings } : settings;
      persistChanges(finalNotes, finalFolders, finalTags, finalSettings);
    } else {
      // Merge mode
      const existingIds = new Set(notes.map((n) => n.id));
      const importedNotes = sanitizeNotes(backup.notes).filter((n) => !existingIds.has(n.id));

      const existingFolderNames = new Set(folders.map((f) => f.name));
      const importedFolders = sanitizeFolders(backup.folders).filter(
        (f) => !existingFolderNames.has(f.name)
      );

      const existingTagNames = new Set(tags.map((t) => t.name));
      const importedTags = sanitizeTags(backup.tags).filter(
        (t) => !existingTagNames.has(t.name)
      );

      persistChanges(
        [...notes, ...importedNotes],
        [...folders, ...importedFolders],
        [...tags, ...importedTags],
        settings
      );
    }
  };

  // Clear all data
  const handleClearAllData = async () => {
    triggerSound('trash');
    await clearAllLocalData();
    setNotes(INITIAL_NOTES);
    setFolders(INITIAL_FOLDERS);
    setTags(INITIAL_TAGS);
    setSettings(DEFAULT_SETTINGS);
    saveAppDataAsync(INITIAL_NOTES, INITIAL_FOLDERS, INITIAL_TAGS, DEFAULT_SETTINGS);
    showToast('所有数据已重置为初始演示状态');
  };

  // Desktop active filtered notes computation based on current view:
  const displayedNotes = useMemo(() => {
    let list = notes.filter((n) => !n.isDeleted);

    // Apply View Mode constraints
    if (settings.viewMode === 'today') {
      // "当日默认视图：仅展示当天创建的所有便签，不受文件夹收纳限制，默认全部展示在像素桌面。已归档便签不在当日默认桌面展示"
      // Plus pinned notes always visible!
      list = list.filter((n) => {
        if (n.isPinned) return true;
        return isSameDay(n.createdAt) && !n.isArchived;
      });
    } else if (settings.viewMode === 'global') {
      // "全局铺满视图：展示所有时间、所有分类的全部便签"
      // All non-deleted notes are shown!
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }

    // Apply folder filter
    if (selectedFolderFilter) {
      list = list.filter((n) => n.folderId === selectedFolderFilter);
    }

    // Apply tag filter
    if (selectedTagFilter) {
      list = list.filter((n) => n.tagIds?.includes(selectedTagFilter));
    }

    // Apply star filter
    if (starFilter) {
      list = list.filter((n) => n.isStarred);
    }

    // Apply pin filter
    if (pinFilter) {
      list = list.filter((n) => n.isPinned);
    }

    // Sort: pinned first, then by zIndex or createdAt
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.zIndex || 0) - (a.zIndex || 0);
    });
  }, [
    notes,
    settings.viewMode,
    searchQuery,
    selectedFolderFilter,
    selectedTagFilter,
    starFilter,
    pinFilter,
  ]);

  // Wallpaper CSS styling helper
  const wallpaperStyle = useMemo(() => {
    switch (settings.wallpaper) {
      case 'teal':
        return {
          backgroundColor: '#008080',
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        };
      case 'sunset':
        return {
          background: 'linear-gradient(180deg, #7c2d12 0%, #c2410c 35%, #1e1b4b 100%)',
        };
      case 'night':
        return {
          backgroundColor: '#090d16',
          backgroundImage:
            'linear-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        };
      case 'gameboy':
        return {
          backgroundColor: '#8bac0f',
          backgroundImage:
            'radial-gradient(circle, #306230 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        };
      case 'mac':
        return {
          backgroundColor: '#e2dcc8',
          backgroundImage:
            'repeating-linear-gradient(45deg, #d3cbb4 0, #d3cbb4 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px',
        };
      default:
        return { backgroundColor: '#008080' };
    }
  }, [settings.wallpaper]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#000080] text-white font-mono">
        <div className="p-6 bg-[#c0c0c0] text-black border-4 border-black pixel-box-raised text-center">
          <div className="text-sm font-bold animate-pulse">正在载入像素桌面便签系统...</div>
          <div className="text-xs text-neutral-600 mt-2">读取本地 IndexedDB 存储引擎</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col h-screen w-screen overflow-hidden ${
        settings.crtScanline ? 'crt-overlay' : ''
      }`}
      style={wallpaperStyle}
    >
      {/* 1. Desktop Header Bar (Top Bar Contract) */}
      <DesktopHeader
        currentView={settings.viewMode}
        onSelectView={handleSelectView}
        onNewNote={() => handleOpenNewNote()}
        todayCount={todayActiveCount}
        totalCount={totalActiveCount}
      />

      {/* 2. Desktop Toolbar (Search, Filters, Auto-Archive Alert, Settings) */}
      <DesktopToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFolderFilter={selectedFolderFilter}
        onSelectFolderFilter={setSelectedFolderFilter}
        selectedTagFilter={selectedTagFilter}
        onSelectTagFilter={setSelectedTagFilter}
        starFilter={starFilter}
        onToggleStarFilter={() => setStarFilter(!starFilter)}
        pinFilter={pinFilter}
        onTogglePinFilter={() => setPinFilter(!pinFilter)}
        unarchivedHistoryCount={unarchivedHistoryNotes.length}
        onAutoArchive={handleAutoArchive}
        onOpenSettings={() => {
          triggerSound('open');
          setIsSettingsOpen(true);
        }}
        onOpenTrash={() => {
          triggerSound('open');
          setIsTrashOpen(true);
        }}
        trashCount={deletedNotes.length}
        folders={folders}
        tags={tags}
        onCreateFolder={() => {
          triggerSound('pop');
          setIsNewFolderOpen(true);
        }}
      />

      {/* 3. Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900 text-amber-200 border-2 border-black pixel-box font-mono text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Main Views Container */}
      <main className="flex-1 relative overflow-hidden">
        {settings.viewMode === 'today' || settings.viewMode === 'global' ? (
          <DesktopCanvas
            notes={displayedNotes}
            folders={folders}
            tags={tags}
            settings={settings}
            onEditNote={(note) => {
              triggerSound('open');
              setEditingNote(note);
              setIsEditorOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            onCloneNote={handleCloneNote}
            onUpdateContent={handleUpdateNoteContent}
            onUpdateNotePosition={handleUpdateNotePosition}
            onUpdateFolderPosition={handleUpdateFolderPosition}
            onOpenFolder={(f) => {
              triggerSound('open');
              setActiveFolder(f);
            }}
            onNoteDropOnFolder={handleNoteDropOnFolder}
            onAutoAlignNotes={handleAutoAlignNotes}
            onClearTodayNotes={settings.viewMode === 'today' ? handleClearTodayNotes : undefined}
            isTodayView={settings.viewMode === 'today'}
            unarchivedCount={unarchivedHistoryNotes.length}
            onAutoArchive={handleAutoArchive}
          />
        ) : settings.viewMode === 'timeline' ? (
          <TimelineView
            notes={notes}
            folders={folders}
            tags={tags}
            onEditNote={(note) => {
              triggerSound('open');
              setEditingNote(note);
              setIsEditorOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            onCloneNote={handleCloneNote}
            onUpdateContent={handleUpdateNoteContent}
          />
        ) : (
          <RandomNoteView
            notes={notes}
            folders={folders}
            tags={tags}
            onEditNote={(note) => {
              triggerSound('open');
              setEditingNote(note);
              setIsEditorOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            onCloneNote={handleCloneNote}
            onUpdateContent={handleUpdateNoteContent}
          />
        )}
      </main>

      {/* 5. Windows / Modals */}
      {/* Note Editor */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        note={editingNote}
        folders={folders}
        tags={tags}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        onCreateTag={handleCreateTag}
      />

      {/* Folder Inspector Window */}
      <FolderWindowModal
        folder={activeFolder}
        isOpen={Boolean(activeFolder)}
        onClose={() => setActiveFolder(null)}
        notes={notes}
        folders={folders}
        tags={tags}
        onEditNote={(note) => {
          triggerSound('open');
          setEditingNote(note);
          setIsEditorOpen(true);
        }}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onToggleStar={handleToggleStar}
        onToggleArchive={handleToggleArchive}
        onCloneNote={handleCloneNote}
        onUpdateContent={handleUpdateNoteContent}
        onCreateNoteInFolder={(folderId) => handleOpenNewNote(folderId)}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* Recycle Bin Window */}
      <TrashWindowModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        deletedNotes={deletedNotes}
        onRestore={handleRestoreNote}
        onRestoreAll={handleRestoreAll}
        onPermanentDelete={handlePermanentDelete}
        onEmptyTrash={handleEmptyTrash}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          triggerSound('toggle');
          setSettings(newSettings);
          saveAppDataAsync(notes, folders, tags, newSettings);
        }}
        notes={notes}
        folders={folders}
        tags={tags}
        onImportBackup={handleImportBackup}
        onClearAllData={handleClearAllData}
      />

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}

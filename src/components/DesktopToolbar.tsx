import React from 'react';
import { Folder, Tag } from '../types';
import { PixelIcon } from './PixelIcon';

interface DesktopToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFolderFilter: string | null;
  onSelectFolderFilter: (folderId: string | null) => void;
  selectedTagFilter: string | null;
  onSelectTagFilter: (tagId: string | null) => void;
  starFilter: boolean;
  onToggleStarFilter: () => void;
  pinFilter: boolean;
  onTogglePinFilter: () => void;
  unarchivedHistoryCount: number;
  onAutoArchive: () => void;
  onOpenSettings: () => void;
  onOpenTrash: () => void;
  trashCount: number;
  folders: Folder[];
  tags: Tag[];
  onCreateFolder: () => void;
}

export const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFolderFilter,
  onSelectFolderFilter,
  selectedTagFilter,
  onSelectTagFilter,
  starFilter,
  onToggleStarFilter,
  pinFilter,
  onTogglePinFilter,
  unarchivedHistoryCount,
  onAutoArchive,
  onOpenSettings,
  onOpenTrash,
  trashCount,
  folders,
  tags,
  onCreateFolder,
}) => {
  return (
    <div className="h-10 bg-[#c0c0c0] border-b-2 border-black px-3 flex items-center justify-between gap-2 text-xs font-mono select-none shrink-0 z-30 shadow-xs">
      {/* Left: Search input & Filters */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Search Input */}
        <div className="relative flex items-center w-48 sm:w-60 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索便签内容/标题..."
            className="w-full pl-6 pr-5 py-1 bg-white border border-black text-xs outline-none focus:bg-amber-50"
          />
          <div className="absolute left-1.5 pointer-events-none opacity-60">
            <PixelIcon name="search" size={13} />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-1 text-neutral-500 hover:text-black font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Filter: Folder */}
        <select
          value={selectedFolderFilter || ''}
          onChange={(e) => onSelectFolderFilter(e.target.value || null)}
          className="px-2 py-1 bg-white border border-black text-xs outline-none truncate max-w-[120px]"
        >
          <option value="">全部文件夹</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              📁 {f.name}
            </option>
          ))}
        </select>

        {/* Quick Filter: Tag */}
        <select
          value={selectedTagFilter || ''}
          onChange={(e) => onSelectTagFilter(e.target.value || null)}
          className="px-2 py-1 bg-white border border-black text-xs outline-none truncate max-w-[110px]"
        >
          <option value="">全部标签</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              #{t.name}
            </option>
          ))}
        </select>

        {/* Star & Pin toggle filters */}
        <button
          type="button"
          onClick={onToggleStarFilter}
          className={`px-2 py-1 border border-black pixel-btn flex items-center gap-1 ${
            starFilter ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-white text-neutral-700'
          }`}
          title="筛选仅星标便签"
        >
          <PixelIcon name="star" size={13} color={starFilter ? '#d97706' : 'none'} />
          <span className="hidden sm:inline">星标</span>
        </button>

        <button
          type="button"
          onClick={onTogglePinFilter}
          className={`px-2 py-1 border border-black pixel-btn flex items-center gap-1 ${
            pinFilter ? 'bg-red-200 text-red-900 font-bold' : 'bg-white text-neutral-700'
          }`}
          title="筛选仅置顶便签"
        >
          <PixelIcon name="pin" size={13} />
          <span className="hidden sm:inline">置顶</span>
        </button>
      </div>

      {/* Right: Actions (Auto-Archive, New Folder, Trash, Settings) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Auto Archive Button with Unarchived Alert Badge */}
        <button
          type="button"
          onClick={onAutoArchive}
          className="relative px-2.5 py-1 bg-white hover:bg-neutral-100 border border-black pixel-btn flex items-center gap-1.5"
          title="将历史非当天且已设置文件夹的便签一键归档到文件夹"
        >
          <PixelIcon name="archive" size={14} />
          <span className="hidden sm:inline">一键自动归档</span>
          {unarchivedHistoryCount > 0 && (
            <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold border border-black flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
              <span>{unarchivedHistoryCount} 待归集</span>
            </span>
          )}
        </button>

        {/* New Folder */}
        <button
          type="button"
          onClick={onCreateFolder}
          className="px-2 py-1 bg-white hover:bg-neutral-100 border border-black pixel-btn flex items-center gap-1"
          title="新建桌面文件夹"
        >
          <PixelIcon name="folder" size={14} color="#f59e0b" />
          <span className="hidden md:inline">+ 文件夹</span>
        </button>

        {/* Trash */}
        <button
          type="button"
          onClick={onOpenTrash}
          className="px-2 py-1 bg-white hover:bg-neutral-100 border border-black pixel-btn flex items-center gap-1"
          title="打开回收站"
        >
          <PixelIcon name="trash" size={14} />
          <span className="hidden md:inline">回收站</span>
          {trashCount > 0 && (
            <span className="px-1 bg-neutral-300 border border-black text-[10px]">
              {trashCount}
            </span>
          )}
        </button>

        {/* Settings & Backup */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-2 py-1 bg-white hover:bg-neutral-100 border border-black pixel-btn flex items-center gap-1"
          title="系统设置与数据备份"
        >
          <PixelIcon name="settings" size={14} />
          <span className="hidden lg:inline">设置</span>
        </button>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { DesktopSettings, Note, Folder, Tag, WallpaperTheme, BackupData } from '../types';
import { PixelWindow } from './PixelWindow';
import { PixelIcon } from './PixelIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: DesktopSettings) => void;
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  onImportBackup: (data: BackupData, mode: 'merge' | 'overwrite') => void;
  onClearAllData: () => void;
}

const WALLPAPERS: { id: WallpaperTheme; name: string; bg: string; border: string }[] = [
  { id: 'teal', name: 'Win95经典青绿', bg: '#008080', border: '#005f5f' },
  { id: 'sunset', name: '8-bit日落暮色', bg: '#7c2d12', border: '#c2410c' },
  { id: 'night', name: '赛博星宿暗夜', bg: '#0f172a', border: '#38bdf8' },
  { id: 'gameboy', name: '掌机橄榄原野', bg: '#8bac0f', border: '#306230' },
  { id: 'mac', name: 'Macintosh复古米', bg: '#e2dcc8', border: '#b8b098' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  notes,
  folders,
  tags,
  onImportBackup,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute stats
  const totalNotes = notes.length;
  const activeNotes = notes.filter((n) => !n.isDeleted).length;
  const archivedNotes = notes.filter((n) => n.isArchived && !n.isDeleted).length;
  const starredNotes = notes.filter((n) => n.isStarred && !n.isDeleted).length;
  const pinnedNotes = notes.filter((n) => n.isPinned && !n.isDeleted).length;
  const trashNotes = notes.filter((n) => n.isDeleted).length;

  const handleExportJSON = () => {
    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: Date.now(),
      notes,
      folders,
      tags,
      settings,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('✓ 备份文件已成功导出！');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.notes)) {
          alert('导入失败：文件格式不符合备份文件规范。');
          return;
        }
        onImportBackup(parsed as BackupData, importMode);
        setStatusMessage(`✓ 已成功以【${importMode === 'merge' ? '智能合并' : '完整覆盖'}】模式导入便签数据！`);
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err) {
        alert('导入失败：JSON解析异常，请检查备份文件。');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <PixelWindow
      title="⚙ 像素桌面系统设置与数据备份"
      isOpen={isOpen}
      onClose={onClose}
      initialSize={{ width: 640, height: 530 }}
      icon="settings"
      zIndex={110}
    >
      <div className="flex flex-col h-full gap-4 text-xs font-mono">
        {/* Status notification toast */}
        {statusMessage && (
          <div className="p-2 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 font-bold text-center pixel-box">
            {statusMessage}
          </div>
        )}

        {/* Section 1: Desktop Appearance & Sound */}
        <div className="p-3 bg-white border-2 border-black pixel-box">
          <h3 className="font-bold text-sm mb-2 pb-1 border-b border-black/20 flex items-center gap-1.5">
            <PixelIcon name="settings" size={16} />
            <span>个性化桌面外观</span>
          </h3>

          <div className="space-y-3">
            {/* Wallpaper selection */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1.5">
                桌面复古壁纸风格:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, wallpaper: wp.id })}
                    className={`flex flex-col items-center p-1.5 border-2 text-[10px] pixel-btn ${
                      settings.wallpaper === wp.id ? 'border-black font-bold ring-2 ring-black' : 'border-neutral-300'
                    }`}
                  >
                    <div
                      className="w-full h-7 border border-black/40 mb-1"
                      style={{ backgroundColor: wp.bg }}
                    />
                    <span className="truncate w-full text-center">{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Size, Sound, CRT toggles */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-black/10">
              {/* Folder Icon Size */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  文件夹图标大小:
                </label>
                <div className="flex items-center gap-1">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, folderIconSize: sz })}
                      className={`flex-1 py-1 border text-[11px] pixel-btn ${
                        settings.folderIconSize === sz
                          ? 'bg-black text-white font-bold border-black'
                          : 'bg-neutral-100 border-neutral-400'
                      }`}
                    >
                      {sz === 'sm' ? '小号' : sz === 'md' ? '标准' : '大号'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound switch */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  8-bit 复古音效:
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className={`w-full py-1 border text-[11px] pixel-btn flex items-center justify-center gap-1 font-bold ${
                    settings.soundEnabled
                      ? 'bg-emerald-100 text-emerald-900 border-black'
                      : 'bg-neutral-200 text-neutral-600 border-neutral-400'
                  }`}
                >
                  <PixelIcon name={settings.soundEnabled ? 'sound-on' : 'sound-off'} size={14} />
                  <span>{settings.soundEnabled ? '已开启' : '已静音'}</span>
                </button>
              </div>

              {/* CRT Scanline */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  复古CRT扫描线:
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, crtScanline: !settings.crtScanline })}
                  className={`w-full py-1 border text-[11px] pixel-btn font-bold ${
                    settings.crtScanline
                      ? 'bg-indigo-100 text-indigo-900 border-black'
                      : 'bg-neutral-200 text-neutral-600 border-neutral-400'
                  }`}
                >
                  {settings.crtScanline ? '✓ CRT特效开启' : '关闭扫描线'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Local Data Statistics */}
        <div className="p-3 bg-white border-2 border-black pixel-box">
          <h3 className="font-bold text-sm mb-2 pb-1 border-b border-black/20">
            📊 本地数据统计 (IndexedDB / LocalStorage)
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            <div className="p-2 bg-neutral-100 border border-neutral-300">
              <div className="text-[10px] text-neutral-500">便签总数</div>
              <div className="text-base font-bold text-neutral-900">{totalNotes}</div>
            </div>
            <div className="p-2 bg-neutral-100 border border-neutral-300">
              <div className="text-[10px] text-neutral-500">正常便签</div>
              <div className="text-base font-bold text-emerald-700">{activeNotes}</div>
            </div>
            <div className="p-2 bg-neutral-100 border border-neutral-300">
              <div className="text-[10px] text-neutral-500">已归档</div>
              <div className="text-base font-bold text-purple-700">{archivedNotes}</div>
            </div>
            <div className="p-2 bg-neutral-100 border border-neutral-300">
              <div className="text-[10px] text-neutral-500">星标收藏</div>
              <div className="text-base font-bold text-amber-600">{starredNotes}</div>
            </div>
            <div className="p-2 bg-neutral-100 border border-neutral-300">
              <div className="text-[10px] text-neutral-500">固定置顶</div>
              <div className="text-base font-bold text-red-600">{pinnedNotes}</div>
            </div>
            <div className="p-2 bg-neutral-100 border border-neutral-300">
              <div className="text-[10px] text-neutral-500">回收站</div>
              <div className="text-base font-bold text-neutral-600">{trashNotes}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Backup & Restore */}
        <div className="p-3 bg-white border-2 border-black pixel-box">
          <h3 className="font-bold text-sm mb-2 pb-1 border-b border-black/20 flex items-center gap-1.5">
            <PixelIcon name="archive" size={16} />
            <span>全局数据导入与导出备份</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Export */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1">
              <span className="text-[11px] text-neutral-600">
                将所有便签、文件夹及设置导出为单份 JSON 离线备份文件：
              </span>
              <button
                type="button"
                onClick={handleExportJSON}
                className="mt-1 px-4 py-2 bg-[#fef08a] hover:bg-[#fde047] font-bold border-2 border-black pixel-btn text-xs flex items-center justify-center gap-1.5"
              >
                <span>💾 导出全部备份 (JSON)</span>
              </button>
            </div>

            {/* Import */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-black/20 pt-2 sm:pt-0 sm:pl-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-600">导入模式:</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                    />
                    <span>智能合并</span>
                  </label>
                  <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'overwrite'}
                      onChange={() => setImportMode('overwrite')}
                    />
                    <span>彻底覆盖</span>
                  </label>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#e0f2fe] hover:bg-[#bae6fd] font-bold border-2 border-black pixel-btn text-xs flex items-center justify-center gap-1.5"
              >
                <span>📂 选择备份文件并导入</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Factory Reset / Danger Zone */}
        <div className="p-3 bg-red-50 border-2 border-red-800 pixel-box flex items-center justify-between">
          <div>
            <div className="font-bold text-red-900 text-xs">⚠️ 重置与清空所有本地数据</div>
            <div className="text-[10px] text-red-700 mt-0.5">
              将清除浏览器 LocalStorage 和 IndexedDB 中的全部便签记录
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('警告：确定要清空全部本地数据并恢复初始演示状态吗？建议先导出备份！')) {
                onClearAllData();
                onClose();
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold border border-black pixel-btn text-xs"
          >
            清空所有数据
          </button>
        </div>
      </div>
    </PixelWindow>
  );
};

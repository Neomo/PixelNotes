import React, { useState } from 'react';
import { PixelWindow } from './PixelWindow';
import { PixelIcon } from './PixelIcon';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string, icon: string) => void;
}

const FOLDER_COLORS = [
  { label: '琥珀金', color: '#fbbf24' },
  { label: '翡翠绿', color: '#34d399' },
  { label: '晴空蓝', color: '#60a5fa' },
  { label: '香芋紫', color: '#a78bfa' },
  { label: '玫瑰粉', color: '#f472b6' },
  { label: '暖砖红', color: '#fb7185' },
];

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0].color);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), selectedColor, 'folder-work');
    setName('');
    onClose();
  };

  return (
    <PixelWindow
      title="📁 新建桌面像素文件夹"
      isOpen={isOpen}
      onClose={onClose}
      initialSize={{ width: 420, height: 260 }}
      icon="folder"
      zIndex={120}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between gap-3 text-xs font-mono">
        <div className="space-y-3">
          <div>
            <label className="block font-bold text-neutral-800 mb-1">文件夹名称:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如: 工作计划、灵感收集..."
              className="w-full px-2 py-1.5 bg-white border-2 border-black text-xs font-bold outline-none focus:bg-amber-50"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1">文件夹主题配色:</label>
            <div className="flex items-center gap-2">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setSelectedColor(c.color)}
                  className={`w-7 h-7 border-2 pixel-btn flex items-center justify-center ${
                    selectedColor === c.color ? 'border-black scale-110 shadow-sm' : 'border-neutral-400'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                >
                  <PixelIcon name="folder" size={14} color="#000" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/20">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#c0c0c0] border border-black pixel-btn"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-1 bg-[#1084d0] text-white font-bold border-2 border-black pixel-btn"
          >
            创建文件夹
          </button>
        </div>
      </form>
    </PixelWindow>
  );
};

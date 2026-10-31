import React, { useState, useEffect } from 'react';
import { Note, Folder, Tag } from '../types';
import { StickyNoteItem } from './StickyNoteItem';
import { PixelIcon } from './PixelIcon';

interface RandomNoteViewProps {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onCloneNote: (note: Note) => void;
  onUpdateContent: (id: string, newContent: string) => void;
}

export const RandomNoteView: React.FC<RandomNoteViewProps> = ({
  notes,
  folders,
  tags,
  onEditNote,
  onDeleteNote,
  onTogglePin,
  onToggleStar,
  onToggleArchive,
  onCloneNote,
  onUpdateContent,
}) => {
  const activeNotes = notes.filter((n) => !n.isDeleted);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Pick random note on mount
  useEffect(() => {
    if (activeNotes.length > 0) {
      const rand = Math.floor(Math.random() * activeNotes.length);
      setSelectedIndex(rand);
    }
  }, [activeNotes.length]);

  const handleNextRandom = () => {
    if (activeNotes.length <= 1) return;
    let next = Math.floor(Math.random() * activeNotes.length);
    if (next === selectedIndex) {
      next = (next + 1) % activeNotes.length;
    }
    setSelectedIndex(next);
  };

  const currentNote = activeNotes[selectedIndex];

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 min-h-[calc(100vh-120px)]">
      {/* Top Controller */}
      <div className="flex items-center gap-3 mb-6 p-2 bg-[#c0c0c0] border-2 border-black pixel-box-raised">
        <div className="flex items-center gap-2 px-2 text-xs font-mono font-bold">
          <PixelIcon name="dice" size={18} />
          <span>随机单签回顾模式</span>
        </div>

        <button
          type="button"
          onClick={handleNextRandom}
          disabled={activeNotes.length <= 1}
          className="px-4 py-1.5 bg-[#fef08a] hover:bg-[#fde047] text-black font-bold border-2 border-black pixel-btn font-mono text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          <span>🎲 换一张抽查</span>
        </button>

        <span className="text-[11px] font-mono text-neutral-600 px-2">
          {activeNotes.length > 0 ? `当前第 ${selectedIndex + 1} / ${activeNotes.length} 条` : '暂无便签'}
        </span>
      </div>

      {/* Main Flashcard / Desk Display */}
      {currentNote ? (
        <div className="relative p-6 bg-amber-900/40 border-4 border-black/80 pixel-box max-w-md w-full flex justify-center">
          <div className="w-full transform scale-105">
            <StickyNoteItem
              note={currentNote}
              folders={folders}
              tags={tags}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
              onTogglePin={onTogglePin}
              onToggleStar={onToggleStar}
              onToggleArchive={onToggleArchive}
              onClone={onCloneNote}
              onUpdateContent={onUpdateContent}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white/80 border-2 border-black pixel-box text-center font-mono">
          <PixelIcon name="dice" size={32} />
          <p className="mt-2 text-sm font-bold">暂无有效便签可供随机抽取</p>
          <p className="text-xs text-neutral-500 mt-1">请先在桌面创建一些便签备忘</p>
        </div>
      )}
    </div>
  );
};

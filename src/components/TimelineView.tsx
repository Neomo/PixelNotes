import React from 'react';
import { Note, Folder, Tag } from '../types';
import { StickyNoteItem } from './StickyNoteItem';
import { getTimelineGroup, TimelineGroup } from '../utils/date';
import { PixelIcon } from './PixelIcon';

interface TimelineViewProps {
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

const GROUPS_ORDER: TimelineGroup[] = ['今天', '昨天', '近7天', '更早时间'];

export const TimelineView: React.FC<TimelineViewProps> = ({
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
  // Filter active (non-deleted) notes
  const activeNotes = notes.filter((n) => !n.isDeleted);

  // Separate pinned vs unpinned notes
  const pinnedNotes = activeNotes.filter((n) => n.isPinned).sort((a, b) => b.createdAt - a.createdAt);
  const unpinnedNotes = activeNotes.filter((n) => !n.isPinned).sort((a, b) => b.createdAt - a.createdAt);

  // Group unpinned notes by date
  const grouped: Record<TimelineGroup, Note[]> = {
    今天: [],
    昨天: [],
    近7天: [],
    更早时间: [],
  };

  unpinnedNotes.forEach((note) => {
    const group = getTimelineGroup(note.createdAt);
    grouped[group].push(note);
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 overflow-y-auto max-h-[calc(100vh-110px)] pb-24">
      {/* Pinned section if any */}
      {pinnedNotes.length > 0 && (
        <div className="mb-8 p-4 bg-amber-50/90 border-2 border-black pixel-box">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/30">
            <PixelIcon name="pin" size={18} />
            <h2 className="font-bold text-sm font-mono tracking-wider text-red-900">
              📌 置顶便签 (优先常驻)
            </h2>
            <span className="text-xs text-neutral-500 font-mono">({pinnedNotes.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <StickyNoteItem
                key={note.id}
                note={note}
                folders={folders}
                tags={tags}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePin}
                onToggleStar={onToggleStar}
                onToggleArchive={onToggleArchive}
                onClone={onCloneNote}
                onUpdateContent={onUpdateContent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Chronological Timeline Groups */}
      <div className="space-y-8">
        {GROUPS_ORDER.map((groupName) => {
          const list = grouped[groupName];
          if (list.length === 0) return null;

          return (
            <div key={groupName} className="relative">
              {/* Group Timeline Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-black text-white font-mono text-xs font-bold pixel-box flex items-center gap-1.5">
                  <PixelIcon name="calendar" size={14} />
                  <span>{groupName}</span>
                </div>
                <div className="text-xs font-mono text-neutral-200">
                  {list.length} 条记录
                </div>
                <div className="flex-1 h-0.5 bg-black/40 border-b border-white/20" />
              </div>

              {/* Grid of notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((note) => (
                  <StickyNoteItem
                    key={note.id}
                    note={note}
                    folders={folders}
                    tags={tags}
                    onEdit={onEditNote}
                    onDelete={onDeleteNote}
                    onTogglePin={onTogglePin}
                    onToggleStar={onToggleStar}
                    onToggleArchive={onToggleArchive}
                    onClone={onCloneNote}
                    onUpdateContent={onUpdateContent}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {activeNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white/80 border-2 border-black pixel-box text-center">
            <PixelIcon name="note" size={40} />
            <h3 className="font-bold text-base mt-2 font-mono">时间轴空空如也</h3>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              快去点击上方「新建便签」记录你的第一条便签吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

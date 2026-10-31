import React, { useState, useRef } from 'react';
import { Note, Folder, Tag, DesktopSettings } from '../types';
import { StickyNoteItem } from './StickyNoteItem';
import { DesktopFolderIcon } from './DesktopFolderIcon';
import { PixelIcon } from './PixelIcon';

interface DesktopCanvasProps {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  settings: DesktopSettings;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onCloneNote: (note: Note) => void;
  onUpdateContent: (id: string, newContent: string) => void;
  onUpdateNotePosition: (id: string, pos: { x: number; y: number }, zIndex: number) => void;
  onUpdateFolderPosition: (id: string, pos: { x: number; y: number }) => void;
  onOpenFolder: (folder: Folder) => void;
  onNoteDropOnFolder: (noteId: string, folderId: string) => void;
  onAutoAlignNotes: () => void;
  onClearTodayNotes?: () => void;
  isTodayView: boolean;
  unarchivedCount: number;
  onAutoArchive: () => void;
}

export const DesktopCanvas: React.FC<DesktopCanvasProps> = ({
  notes,
  folders,
  tags,
  settings,
  onEditNote,
  onDeleteNote,
  onTogglePin,
  onToggleStar,
  onToggleArchive,
  onCloneNote,
  onUpdateContent,
  onUpdateNotePosition,
  onUpdateFolderPosition,
  onOpenFolder,
  onNoteDropOnFolder,
  onAutoAlignNotes,
  onClearTodayNotes,
  isTodayView,
  unarchivedCount,
  onAutoArchive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxZIndex, setMaxZIndex] = useState(20);
  const [activeDragNoteId, setActiveDragNoteId] = useState<string | null>(null);

  // Handle note dragging across the desktop
  const handleNoteDragStart = (e: React.MouseEvent, note: Note) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = note.position?.x ?? 200;
    const initY = note.position?.y ?? 100;
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setActiveDragNoteId(note.id);

    let currentX = initX;
    let currentY = initY;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      let newX = initX + dx;
      let newY = initY + dy;

      // Bound within container
      const maxX = container.clientWidth - 260;
      const maxY = container.clientHeight - 200;
      newX = Math.max(10, Math.min(maxX, newX));
      newY = Math.max(10, Math.min(maxY, newY));

      currentX = newX;
      currentY = newY;

      // Update position
      const noteEl = document.getElementById(`desktop-note-${note.id}`);
      if (noteEl) {
        noteEl.style.left = `${newX}px`;
        noteEl.style.top = `${newY}px`;
        noteEl.style.zIndex = `${nextZ}`;
      }
    };

    const handleMouseUp = (me: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setActiveDragNoteId(null);

      // Check if dropped onto a desktop folder
      const elementsUnderPoint = document.elementsFromPoint(me.clientX, me.clientY);
      for (const el of elementsUnderPoint) {
        const folderTarget = el.closest('[data-folder-id]');
        if (folderTarget) {
          const folderId = folderTarget.getAttribute('data-folder-id');
          if (folderId) {
            onNoteDropOnFolder(note.id, folderId);
            return;
          }
        }
      }

      // Grid snap if enabled
      let finalX = currentX;
      let finalY = currentY;
      if (settings.gridSnap) {
        finalX = Math.round(finalX / 20) * 20;
        finalY = Math.round(finalY / 20) * 20;
      }

      onUpdateNotePosition(note.id, { x: finalX, y: finalY }, nextZ);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-88px)] overflow-hidden select-none"
    >
      {/* Unarchived banner prompt if any */}
      {unarchivedCount > 0 && isTodayView && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 bg-amber-100 border-2 border-black pixel-box font-mono text-xs shadow-md">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="text-amber-900 font-bold">
            提示：检测到 {unarchivedCount} 条已绑定文件夹的历史便签待整理
          </span>
          <button
            type="button"
            onClick={onAutoArchive}
            className="px-2 py-0.5 bg-amber-300 hover:bg-amber-400 text-black font-bold border border-black pixel-btn text-[11px]"
          >
            一键归集
          </button>
        </div>
      )}

      {/* Desktop Folders Icons Layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {folders.map((folder) => {
          const folderNotes = notes.filter((n) => n.folderId === folder.id && !n.isDeleted);
          const unarchivedInFolder = folderNotes.filter((n) => !n.isArchived).length;

          return (
            <div
              key={folder.id}
              data-folder-id={folder.id}
              className="pointer-events-auto"
            >
              <DesktopFolderIcon
                folder={folder}
                noteCount={folderNotes.length}
                unarchivedCount={unarchivedInFolder}
                iconSize={settings.folderIconSize}
                onClick={() => onOpenFolder(folder)}
                onDragEnd={(folderId, newPos) => onUpdateFolderPosition(folderId, newPos)}
                onNoteDrop={(noteId, targetFolderId) => onNoteDropOnFolder(noteId, targetFolderId)}
              />
            </div>
          );
        })}
      </div>

      {/* Sticky Notes Canvas Layer */}
      {notes.map((note) => {
        const isDragging = activeDragNoteId === note.id;
        const x = note.position?.x ?? 200;
        const y = note.position?.y ?? 100;
        const z = isDragging ? 40 : (note.zIndex || 5);

        return (
          <div
            id={`desktop-note-${note.id}`}
            key={note.id}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              zIndex: z,
            }}
            className="transition-shadow duration-75"
          >
            <StickyNoteItem
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
              draggable={true}
              onDragStart={handleNoteDragStart}
            />
          </div>
        );
      })}

      {/* Empty State when no notes are on desktop */}
      {notes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <div className="p-6 bg-black/60 text-white border-2 border-white/60 pixel-box text-center max-w-sm pointer-events-auto">
            <PixelIcon name="note" size={36} color="#fef08a" className="mx-auto mb-2" />
            <h3 className="font-bold text-sm font-mono tracking-wider text-amber-200">
              {isTodayView ? '今日桌面暂无新建便签' : '当前视图暂无便签'}
            </h3>
            <p className="text-xs text-neutral-300 mt-1 font-mono leading-relaxed">
              {isTodayView
                ? '今天创建的便签会自动常驻于此，不受归档影响。'
                : '所有分类便签已被收纳或清空。'}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={onAutoAlignNotes}
          className="px-2.5 py-1.5 bg-[#c0c0c0] hover:bg-[#d4d4d4] text-black font-bold border-2 border-black pixel-btn font-mono text-xs flex items-center gap-1 shadow-md"
          title="将桌面上分散重叠的便签整齐对齐排列"
        >
          <PixelIcon name="grid" size={14} />
          <span>自动对齐桌面</span>
        </button>

        {isTodayView && notes.length > 0 && onClearTodayNotes && (
          <button
            type="button"
            onClick={onClearTodayNotes}
            className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 border-2 border-black pixel-btn font-mono text-xs shadow-md"
            title="一键将今日便签全部移入回收站"
          >
            清空今日
          </button>
        )}
      </div>
    </div>
  );
};

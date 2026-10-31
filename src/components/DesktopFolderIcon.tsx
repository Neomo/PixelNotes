import React, { useState } from 'react';
import { Folder } from '../types';
import { PixelIcon } from './PixelIcon';

interface DesktopFolderIconProps {
  folder: Folder;
  noteCount: number;
  unarchivedCount: number;
  iconSize: 'sm' | 'md' | 'lg';
  onClick: () => void;
  onDragEnd: (folderId: string, newPos: { x: number; y: number }) => void;
  onNoteDrop: (noteId: string, folderId: string) => void;
}

const SIZE_CONFIG = {
  sm: { icon: 32, box: 'w-20', text: 'text-[10px]' },
  md: { icon: 42, box: 'w-24', text: 'text-[11px]' },
  lg: { icon: 54, box: 'w-28', text: 'text-xs' },
};

export const DesktopFolderIcon: React.FC<DesktopFolderIconProps> = ({
  folder,
  noteCount,
  unarchivedCount,
  iconSize,
  onClick,
  onDragEnd,
  onNoteDrop,
}) => {
  const [pos, setPos] = useState(folder.position);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const sizeMeta = SIZE_CONFIG[iconSize] || SIZE_CONFIG.md;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const initX = pos.x;
    const initY = pos.y;
    let hasMoved = false;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
        setIsDragging(true);
        setPos({
          x: Math.max(10, Math.min(window.innerWidth - 100, initX + dx)),
          y: Math.max(60, Math.min(window.innerHeight - 100, initY + dy)),
        });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (hasMoved) {
        setIsDragging(false);
        onDragEnd(folder.id, pos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Drag-and-drop archiving target
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDropTarget(true);
  };

  const handleDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    const noteId = e.dataTransfer.getData('text/plain');
    if (noteId) {
      onNoteDrop(noteId, folder.id);
    }
  };

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        position: 'absolute',
        zIndex: isDragging ? 35 : 15,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => {
        if (!isDragging) onClick();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group flex flex-col items-center justify-center p-2 select-none cursor-pointer transition-transform duration-75 ${
        sizeMeta.box
      } ${
        isDropTarget
          ? 'scale-110 bg-amber-300/40 border-2 border-dashed border-amber-400 pixel-box'
          : 'hover:bg-black/15'
      }`}
    >
      {/* Folder Graphic with badge */}
      <div className="relative">
        <PixelIcon name={folder.icon} size={sizeMeta.icon} color={folder.color} />

        {/* Note count counter */}
        {noteCount > 0 && (
          <div className="absolute -top-1 -right-2 px-1 bg-black text-white text-[9px] font-mono font-bold border border-white">
            {noteCount}
          </div>
        )}

        {/* Unarchived past notes warning dot */}
        {unarchivedCount > 0 && (
          <div
            className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"
            title={`${unarchivedCount} 条历史便签未收纳归档`}
          />
        )}
      </div>

      {/* Folder Label */}
      <div className={`mt-1 font-mono font-bold text-center truncate w-full ${sizeMeta.text}`}>
        <span className="bg-black/75 text-white px-1.5 py-0.5 border border-black/40">
          {folder.name}
        </span>
      </div>
    </div>
  );
};

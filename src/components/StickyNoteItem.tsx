import React, { useRef } from 'react';
import { Note, Folder, Tag } from '../types';
import { PixelIcon } from './PixelIcon';
import { formatTimeOnly, formatDateOnly } from '../utils/date';
import { NOTE_COLOR_MAP, getNoteTextureStyle } from '../utils/noteStyles';

interface StickyNoteItemProps {
  note: Note;
  folders: Folder[];
  tags: Tag[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onClone: (note: Note) => void;
  onUpdateContent?: (id: string, newContent: string) => void;
  onDragStart?: (e: React.MouseEvent, note: Note) => void;
  draggable?: boolean;
  className?: string;
}

export const StickyNoteItem: React.FC<StickyNoteItemProps> = ({
  note,
  folders,
  tags,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleStar,
  onToggleArchive,
  onClone,
  onUpdateContent,
  onDragStart,
  draggable = false,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const colorScheme = NOTE_COLOR_MAP[note.color] || NOTE_COLOR_MAP.yellow;
  const textureStyle = getNoteTextureStyle(note.texture, note.color);
  const folder = folders.find((f) => f.id === note.folderId);
  const assignedTags = tags.filter((t) => note.tagIds?.includes(t.id));

  // Handle interactive checkboxes in content
  const handleToggleCheckbox = (e: React.MouseEvent, lineIndex: number) => {
    e.stopPropagation();
    if (!onUpdateContent) return;
    const lines = note.content.split('\n');
    const targetLine = lines[lineIndex];
    if (targetLine.includes('- [ ]')) {
      lines[lineIndex] = targetLine.replace('- [ ]', '- [x]');
    } else if (targetLine.includes('- [x]')) {
      lines[lineIndex] = targetLine.replace('- [x]', '- [ ]');
    }
    onUpdateContent(note.id, lines.join('\n'));
  };

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${note.title}\n\n${note.content}`;
    navigator.clipboard?.writeText(text);
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={(e) => {
        if (draggable && onDragStart) {
          // Only start dragging if target is not a button or input
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('input')) {
            onDragStart(e, note);
          }
        }
      }}
      className={`group relative flex flex-col pixel-note-shadow select-none transition-transform duration-75 hover:scale-[1.01] ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      } ${className}`}
      style={{
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
        minWidth: '240px',
        maxWidth: '320px',
        minHeight: '200px',
      }}
    >
      {/* Top Pin & Action Bar */}
      <div
        className="flex items-center justify-between px-2.5 py-1.5 border-b border-black/15 shrink-0"
        style={{ backgroundColor: colorScheme.headerBg }}
      >
        {/* Left: Pin indicator / button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className="p-0.5 hover:scale-110 transition-transform"
            title={note.isPinned ? '取消置顶' : '固定置顶'}
          >
            {note.isPinned ? (
              <PixelIcon name="pin" size={16} />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full border border-black/40 bg-black/10 group-hover:bg-red-400" />
            )}
          </button>
          {note.isPinned && (
            <span className="text-[10px] font-bold tracking-tight text-red-600 bg-red-100/80 px-1 border border-red-500/40">
              置顶
            </span>
          )}
        </div>

        {/* Center: Folder Chip if assigned */}
        {folder && (
          <div
            className="text-[10px] truncate max-w-[100px] px-1 bg-black/10 border border-black/20 font-mono"
            title={`收纳文件夹: ${folder.name}`}
          >
            📁 {folder.name}
          </div>
        )}

        {/* Right: Star and menu actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(note.id);
            }}
            className="p-0.5 hover:scale-125 transition-transform"
            title={note.isStarred ? '取消星标' : '添加星标'}
          >
            <PixelIcon
              name="star"
              size={15}
              color={note.isStarred ? '#f59e0b' : 'none'}
              className={note.isStarred ? 'opacity-100' : 'opacity-30 hover:opacity-75'}
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="px-1 py-0.5 text-[10px] font-mono bg-black/10 hover:bg-black/20 border border-black/30 pixel-btn"
            title="编辑便签"
          >
            ✎
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="px-1 py-0.5 text-[10px] font-mono bg-red-500/20 hover:bg-red-500 text-red-900 hover:text-white border border-black/30 pixel-btn"
            title="移入回收站"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Note Body */}
      <div
        onClick={() => onEdit(note)}
        style={textureStyle}
        className="flex-1 p-3 cursor-pointer overflow-hidden flex flex-col justify-between"
      >
        <div>
          {/* Note Title */}
          <h3 className="font-bold text-sm tracking-wide leading-snug line-clamp-2 border-b border-black/10 pb-1 mb-2 font-mono">
            {note.title || '无标题便签'}
          </h3>

          {/* Note Content / Checkboxes */}
          <div className="space-y-1 text-xs leading-relaxed font-sans line-clamp-6">
            {note.content.split('\n').map((line, idx) => {
              const isTodoUnchecked = line.startsWith('- [ ] ');
              const isTodoChecked = line.startsWith('- [x] ') || line.startsWith('- [X] ');

              if (isTodoUnchecked || isTodoChecked) {
                const todoText = line.substring(6);
                return (
                  <div
                    key={idx}
                    onClick={(e) => handleToggleCheckbox(e, idx)}
                    className="flex items-start gap-1.5 py-0.5 hover:bg-black/5 cursor-pointer rounded-xs"
                  >
                    <span className="mt-0.5 shrink-0 inline-block w-3.5 h-3.5 border border-black text-[9px] font-bold text-center leading-3 bg-white">
                      {isTodoChecked ? '✓' : ''}
                    </span>
                    <span className={isTodoChecked ? 'line-through opacity-60' : ''}>
                      {todoText}
                    </span>
                  </div>
                );
              }

              if (line.startsWith('> ')) {
                return (
                  <p key={idx} className="pl-2 border-l-2 border-black/30 italic opacity-85 text-[11px]">
                    {line.substring(2)}
                  </p>
                );
              }

              if (!line.trim()) {
                return <div key={idx} className="h-1.5" />;
              }

              return <p key={idx} className="break-words">{line}</p>;
            })}
          </div>
        </div>

        {/* Footer info: tags & timestamp */}
        <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[10px] opacity-75">
          <div className="flex flex-wrap gap-1 items-center max-w-[160px]">
            {assignedTags.map((tag) => (
              <span
                key={tag.id}
                className="px-1 py-0.2 border border-black/30 font-mono text-[9px]"
                style={{ backgroundColor: tag.color + '33', color: colorScheme.text }}
              >
                #{tag.name}
              </span>
            ))}
          </div>

          <div className="font-mono text-right shrink-0">
            {formatDateOnly(note.createdAt) === formatDateOnly(Date.now())
              ? formatTimeOnly(note.createdAt)
              : formatDateOnly(note.createdAt)}
          </div>
        </div>
      </div>

      {/* Quick hover bottom action strip */}
      <div className="px-2 py-1 bg-black/5 border-t border-black/15 flex items-center justify-between text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopyText}
            className="hover:underline text-[9px]"
            title="复制便签纯文本"
          >
            复制文本
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClone(note);
            }}
            className="hover:underline text-[9px]"
            title="克隆此便签"
          >
            克隆
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleArchive(note.id);
          }}
          className="hover:underline text-[9px] font-bold"
          title={note.isArchived ? '移出文件夹回到桌面' : '收纳归档到文件夹'}
        >
          {note.isArchived ? '取消归档' : '立即归档'}
        </button>
      </div>

      {/* Folded corner aesthetic */}
      <div
        className="absolute bottom-0 right-0 w-3.5 h-3.5 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%, ${colorScheme.border} 100%)`,
        }}
      />
    </div>
  );
};

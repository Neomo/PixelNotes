import React from 'react';
import { Note } from '../types';
import { PixelWindow } from './PixelWindow';
import { PixelIcon } from './PixelIcon';
import { formatDateTime } from '../utils/date';

interface TrashWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedNotes: Note[];
  onRestore: (id: string) => void;
  onRestoreAll: () => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

export const TrashWindowModal: React.FC<TrashWindowModalProps> = ({
  isOpen,
  onClose,
  deletedNotes,
  onRestore,
  onRestoreAll,
  onPermanentDelete,
  onEmptyTrash,
}) => {
  if (!isOpen) return null;

  return (
    <PixelWindow
      title={`🗑️ 像素回收站 (${deletedNotes.length} 条已删除便签)`}
      isOpen={isOpen}
      onClose={onClose}
      initialSize={{ width: 620, height: 460 }}
      icon="trash"
      zIndex={90}
    >
      <div className="flex flex-col h-full gap-3 text-xs">
        {/* Top actions */}
        <div className="flex items-center justify-between p-2 bg-[#d4d4d4] border-2 border-black">
          <div className="flex items-center gap-2">
            <PixelIcon name="trash" size={20} />
            <span className="font-mono text-neutral-700">
              便签软删除保护机制 · 可随时还原或永久擦除
            </span>
          </div>

          <div className="flex items-center gap-2">
            {deletedNotes.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={onRestoreAll}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-black pixel-btn font-mono"
                >
                  全部还原
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('确定要彻底清空回收站吗？此操作无法撤销。')) {
                      onEmptyTrash();
                    }
                  }}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold border border-black pixel-btn font-mono"
                >
                  清空回收站
                </button>
              </>
            )}
          </div>
        </div>

        {/* List of deleted notes */}
        <div className="flex-1 overflow-y-auto p-2 border border-black bg-white">
          {deletedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-400 gap-2 font-mono">
              <PixelIcon name="trash" size={32} />
              <p>回收站是空的，没有任何被删除的便签</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deletedNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-2 bg-neutral-100 border border-black hover:bg-neutral-50"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-bold text-sm truncate font-mono text-neutral-800">
                      {note.title || '无标题便签'}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {note.content.substring(0, 80) || '(无内容)'}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-1">
                      创建时间: {formatDateTime(note.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRestore(note.id)}
                      className="px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-black pixel-btn font-mono font-bold"
                    >
                      还原
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`确定彻底删除便签 "${note.title}" 吗？`)) {
                          onPermanentDelete(note.id);
                        }
                      }}
                      className="px-2 py-1 bg-white hover:bg-red-100 text-red-700 border border-black pixel-btn font-mono"
                    >
                      彻底删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PixelWindow>
  );
};

import React, { useState } from 'react';
import { Folder, Note, Tag } from '../types';
import { PixelWindow } from './PixelWindow';
import { StickyNoteItem } from './StickyNoteItem';
import { PixelIcon } from './PixelIcon';

interface FolderWindowModalProps {
  folder: Folder | null;
  isOpen: boolean;
  onClose: () => void;
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
  onCreateNoteInFolder: (folderId: string) => void;
  onUpdateFolder: (updated: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
}

export const FolderWindowModal: React.FC<FolderWindowModalProps> = ({
  folder,
  isOpen,
  onClose,
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
  onCreateNoteInFolder,
  onUpdateFolder,
  onDeleteFolder,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [folderName, setFolderName] = useState('');

  if (!isOpen || !folder) return null;

  const folderNotes = notes.filter((n) => n.folderId === folder.id && !n.isDeleted);
  const archivedCount = folderNotes.filter((n) => n.isArchived).length;

  const handleStartRename = () => {
    setFolderName(folder.name);
    setIsRenaming(true);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onUpdateFolder({ ...folder, name: folderName.trim() });
    }
    setIsRenaming(false);
  };

  return (
    <PixelWindow
      title={`📁 虚拟文件夹: ${folder.name}`}
      isOpen={isOpen}
      onClose={onClose}
      initialSize={{ width: 700, height: 500 }}
      icon="folder"
      zIndex={80}
    >
      <div className="flex flex-col h-full gap-3 text-xs">
        {/* Top Folder Header / Bar */}
        <div className="flex items-center justify-between p-2 bg-[#d4d4d4] border-2 border-black">
          <div className="flex items-center gap-2">
            <PixelIcon name={folder.icon} size={24} color={folder.color} />
            {isRenaming ? (
              <form onSubmit={handleSaveRename} className="flex items-center gap-1">
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="px-1.5 py-0.5 bg-white border border-black font-bold outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-white border border-black pixel-btn font-mono"
                >
                  确定
                </button>
              </form>
            ) : (
              <div>
                <span className="font-bold text-sm tracking-wide font-mono mr-2">
                  {folder.name}
                </span>
                <button
                  type="button"
                  onClick={handleStartRename}
                  className="text-neutral-600 hover:text-black underline text-[11px]"
                >
                  重命名
                </button>
              </div>
            )}
            <span className="text-neutral-500 font-mono text-[11px] ml-2">
              (共 {folderNotes.length} 条便签 · {archivedCount} 条已收纳归档)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCreateNoteInFolder(folder.id)}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 font-bold border border-black pixel-btn font-mono flex items-center gap-1"
            >
              <PixelIcon name="plus" size={12} />
              <span>在此文件夹新建</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`确定要删除文件夹 "${folder.name}" 吗？便签不会丢失，将保留在桌面。`)) {
                  onDeleteFolder(folder.id);
                  onClose();
                }
              }}
              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-900 border border-black pixel-btn font-mono text-[11px]"
              title="删除此文件夹"
            >
              删除文件夹
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex-1 overflow-y-auto p-2 border border-black bg-white/70">
          {folderNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-500 gap-2">
              <PixelIcon name="folder" size={36} color={folder.color} />
              <p className="font-mono text-sm">此文件夹暂无便签收纳</p>
              <p className="text-[11px] text-neutral-400">
                可将桌面便签拖拽至此文件夹图标，或点击上方「在此文件夹新建」
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {folderNotes.map((note) => (
                <div key={note.id} className="relative">
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
                  />
                  {note.isArchived && (
                    <div className="absolute top-2 left-10 pointer-events-none px-1.5 py-0.5 bg-purple-100/90 border border-purple-600 text-purple-900 text-[10px] font-mono font-bold shadow-xs">
                      📁 已收纳归档
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PixelWindow>
  );
};

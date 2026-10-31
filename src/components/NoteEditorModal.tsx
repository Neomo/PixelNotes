import React, { useState, useEffect } from 'react';
import { Note, Folder, Tag, NoteColor } from '../types';
import { PixelWindow } from './PixelWindow';
import { PixelIcon } from './PixelIcon';
import { formatDateTime } from '../utils/date';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  folders: Folder[];
  tags: Tag[];
  onSave: (updated: Note) => void;
  onDelete: (id: string) => void;
  onCreateTag: (name: string, color: string) => Tag;
}

const COLOR_OPTIONS: { key: NoteColor; label: string; bg: string }[] = [
  { key: 'yellow', label: '暖黄', bg: '#fef08a' },
  { key: 'green', label: '薄荷绿', bg: '#bbf7d0' },
  { key: 'blue', label: '天蓝', bg: '#bae6fd' },
  { key: 'pink', label: '樱粉', bg: '#fbcfe8' },
  { key: 'purple', label: '香芋紫', bg: '#ddd6fe' },
  { key: 'beige', label: '复古米', bg: '#f5ebe0' },
  { key: 'dark', label: '暗夜灰', bg: '#334155' },
];

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  note,
  folders,
  tags,
  onSave,
  onDelete,
  onCreateTag,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [copyNotice, setCopyNotice] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setFolderId(note.folderId);
      setSelectedTagIds(note.tagIds || []);
      setIsPinned(note.isPinned);
      setIsStarred(note.isStarred);
      setIsArchived(note.isArchived);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleCreateNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const tagColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];
    const newTag = onCreateTag(newTagName.trim(), randomColor);
    setSelectedTagIds([...selectedTagIds, newTag.id]);
    setNewTagName('');
  };

  const insertHelperText = (prefix: string) => {
    setContent((prev) => (prev ? `${prev}\n${prefix}` : prefix));
  };

  const handleSaveAndClose = () => {
    const updatedNote: Note = {
      ...note,
      title: title.trim() || '无标题便签',
      content,
      color,
      folderId: folderId || null,
      tagIds: selectedTagIds,
      isPinned,
      isStarred,
      isArchived,
      updatedAt: Date.now(),
    };
    onSave(updatedNote);
    onClose();
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(`${title}\n\n${content}`);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 1500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[\\/:*?"<>|]/g, '_') || 'pixel-note'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PixelWindow
      title={note.id.startsWith('new-') ? '★ 新建像素便签' : `✎ 编辑便签: ${note.title || '无标题'}`}
      isOpen={isOpen}
      onClose={handleSaveAndClose}
      initialSize={{ width: 620, height: 540 }}
      icon="note"
      zIndex={100}
    >
      <div className="flex flex-col h-full gap-3 text-xs">
        {/* Title & Quick Status Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入便签标题..."
            className="flex-1 px-2.5 py-1.5 bg-white border-2 border-black font-bold font-mono text-sm outline-none focus:bg-amber-50"
          />

          {/* Pin & Star Quick Toggles */}
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`px-2 py-1.5 flex items-center gap-1 border-2 border-black pixel-btn font-mono ${
              isPinned ? 'bg-red-200 text-red-900 font-bold' : 'bg-white'
            }`}
            title="固定置顶"
          >
            <PixelIcon name="pin" size={14} />
            <span>{isPinned ? '已置顶' : '置顶'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            className={`px-2 py-1.5 flex items-center gap-1 border-2 border-black pixel-btn font-mono ${
              isStarred ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-white'
            }`}
            title="星标收藏"
          >
            <PixelIcon name="star" size={14} color={isStarred ? '#f59e0b' : 'none'} />
            <span>{isStarred ? '已星标' : '星标'}</span>
          </button>
        </div>

        {/* Rich Formatting Fast Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-200 border border-black/40 text-[11px]">
          <span className="font-bold font-mono text-neutral-600 px-1">快捷工具:</span>
          <button
            type="button"
            onClick={() => insertHelperText('- [ ] ')}
            className="px-2 py-0.5 bg-white border border-black pixel-btn"
          >
            + 待办清单
          </button>
          <button
            type="button"
            onClick={() => insertHelperText('- ')}
            className="px-2 py-0.5 bg-white border border-black pixel-btn"
          >
            • 项目点
          </button>
          <button
            type="button"
            onClick={() => insertHelperText('> ')}
            className="px-2 py-0.5 bg-white border border-black pixel-btn"
          >
            “ 引用块
          </button>
          <button
            type="button"
            onClick={() => insertHelperText('### 小标题\n')}
            className="px-2 py-0.5 bg-white border border-black pixel-btn"
          >
            # 标题
          </button>
          <button
            type="button"
            onClick={() => setContent('')}
            className="ml-auto px-2 py-0.5 text-neutral-600 hover:text-red-600 underline"
          >
            清空内容
          </button>
        </div>

        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在此输入便签备忘、任务清单或灵感构想...&#10;支持 - [ ] 待办清单自动解析勾选"
          rows={10}
          className="w-full flex-1 p-2.5 bg-white border-2 border-black font-sans text-xs leading-relaxed outline-none resize-none focus:bg-amber-50"
        />

        {/* Color Palette Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-200 border border-black/30">
          <span className="font-bold text-neutral-700 shrink-0">便签纸色:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setColor(c.key)}
                className={`w-5 h-5 border-2 ${
                  color === c.key ? 'border-black scale-110 shadow-sm' : 'border-neutral-400'
                }`}
                style={{ backgroundColor: c.bg }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Category: Folder & Tags */}
        <div className="grid grid-cols-2 gap-3 p-2 bg-neutral-200 border border-black/30">
          {/* Folder select */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-neutral-700 flex items-center gap-1">
              <PixelIcon name="folder" size={14} />
              <span>收纳文件夹:</span>
            </label>
            <select
              value={folderId || ''}
              onChange={(e) => setFolderId(e.target.value || null)}
              className="px-2 py-1 bg-white border border-black font-mono text-xs outline-none"
            >
              <option value="">(无收纳文件夹 / 留在桌面)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 mt-1">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isArchived}
                  onChange={(e) => setIsArchived(e.target.checked)}
                  className="rounded-none border-black"
                />
                <span className="text-[11px] text-neutral-700">立即归档 (不在当日桌面显示)</span>
              </label>
            </div>
          </div>

          {/* Tags multi-select */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-neutral-700 flex items-center gap-1">
              <PixelIcon name="tag" size={14} />
              <span>标签标记 (多选):</span>
            </label>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto p-1 bg-white border border-black">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.id)}
                    className={`px-1.5 py-0.5 text-[10px] font-mono border ${
                      isSelected
                        ? 'border-black font-bold shadow-xs'
                        : 'border-neutral-300 opacity-60'
                    }`}
                    style={{
                      backgroundColor: isSelected ? tag.color + '44' : '#f1f5f9',
                      color: isSelected ? '#000000' : '#475569',
                    }}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
            {/* Quick add tag */}
            <form onSubmit={handleCreateNewTag} className="flex gap-1 mt-1">
              <input
                type="text"
                placeholder="+ 新标签名称"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 px-1.5 py-0.5 bg-white border border-black text-[11px] outline-none"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-neutral-300 border border-black pixel-btn text-[10px]"
              >
                添加
              </button>
            </form>
          </div>
        </div>

        {/* Timestamps info */}
        <div className="flex items-center justify-between text-[10px] text-neutral-600 px-1 font-mono">
          <span>创建: {formatDateTime(note.createdAt)}</span>
          <span>修改: {formatDateTime(note.updatedAt)}</span>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-black/20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-2 py-1 bg-white border border-black pixel-btn text-[11px]"
            >
              {copyNotice ? '✓ 已复制文本' : '复制全文'}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-2 py-1 bg-white border border-black pixel-btn text-[11px]"
            >
              导出为 .TXT
            </button>
            {!note.id.startsWith('new-') && (
              <button
                type="button"
                onClick={() => {
                  onDelete(note.id);
                  onClose();
                }}
                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-900 border border-black pixel-btn text-[11px]"
              >
                移入回收站
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-[#c0c0c0] border border-black pixel-btn font-mono"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-4 py-1 bg-[#1084d0] text-white font-bold border-2 border-black pixel-btn font-mono"
            >
              完成并保存
            </button>
          </div>
        </div>
      </div>
    </PixelWindow>
  );
};

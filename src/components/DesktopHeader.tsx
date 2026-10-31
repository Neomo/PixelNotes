import React from 'react';
import { ViewMode } from '../types';
import { PixelIcon } from './PixelIcon';

interface DesktopHeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onNewNote: () => void;
  todayCount: number;
  totalCount: number;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentView,
  onSelectView,
  onNewNote,
  todayCount,
  totalCount,
}) => {
  return (
    <header className="h-12 bg-[#000080] text-white border-b-2 border-black flex items-center justify-between gap-8 px-4 select-none shrink-0 z-40">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <PixelIcon name="note" size={20} color="#fef08a" />
        <span className="font-bold text-sm tracking-wider font-mono text-amber-200">
          像素桌面便签
        </span>
      </div>

      {/* Zone 2: 4 Core Navigation View Tabs (Single-line controls) */}
      <nav className="flex items-center gap-1.5 p-1 bg-black/30 border border-white/20 font-mono text-xs">
        <button
          type="button"
          onClick={() => onSelectView('today')}
          className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'today'
              ? 'bg-[#c0c0c0] text-black font-bold pixel-box-raised'
              : 'text-neutral-200 hover:text-white hover:bg-white/10'
          }`}
          title="当日默认视图：仅展示今天创建的全部便签"
        >
          <span>当日便签</span>
          <span className="text-[10px] opacity-75">({todayCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('global')}
          className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'global'
              ? 'bg-[#c0c0c0] text-black font-bold pixel-box-raised'
              : 'text-neutral-200 hover:text-white hover:bg-white/10'
          }`}
          title="全局铺满视图：自由平铺与拖拽所有便签"
        >
          <span>全局铺满</span>
          <span className="text-[10px] opacity-75">({totalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('timeline')}
          className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'timeline'
              ? 'bg-[#c0c0c0] text-black font-bold pixel-box-raised'
              : 'text-neutral-200 hover:text-white hover:bg-white/10'
          }`}
          title="时间轴视图：按今天、昨天、近7天倒序分组"
        >
          <span>时间轴</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('random')}
          className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'random'
              ? 'bg-[#c0c0c0] text-black font-bold pixel-box-raised'
              : 'text-neutral-200 hover:text-white hover:bg-white/10'
          }`}
          title="随机单签视图：随机抽查回顾与备忘"
        >
          <span>随机回顾</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action (Single-line) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onNewNote}
          className="px-3.5 py-1.5 bg-[#fef08a] hover:bg-[#fde047] text-black font-bold text-xs pixel-btn whitespace-nowrap shrink-0 flex items-center gap-1.5 font-mono"
        >
          <PixelIcon name="plus" size={14} />
          <span>新建便签</span>
        </button>
      </div>
    </header>
  );
};

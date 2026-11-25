import React, { useState, useEffect, useRef } from 'react';

interface PixelClockWidgetProps {
  position?: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  gridSnap: boolean;
  onPositionChange: (pos: { x: number; y: number }) => void;
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export const PixelClockWidget: React.FC<PixelClockWidgetProps> = ({
  position,
  containerRef,
  gridSnap,
  onPositionChange,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const getDefaultPos = () => {
    if (typeof window === 'undefined') return { x: 960, y: 20 };
    return { x: Math.max(20, window.innerWidth - 236), y: 20 };
  };

  const [pos, setPos] = useState<{ x: number; y: number }>(() => position || getDefaultPos());
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position) {
      setPos(position);
    }
  }, [position]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    e.preventDefault();
    const container = containerRef.current;
    const widgetWidth = widgetRef.current?.offsetWidth || 208;
    const widgetHeight = widgetRef.current?.offsetHeight || 88;
    const maxX = container ? Math.max(10, container.clientWidth - widgetWidth - 10) : window.innerWidth - 220;
    const maxY = container ? Math.max(10, container.clientHeight - widgetHeight - 10) : window.innerHeight - 120;

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = pos.x;
    const initY = pos.y;
    let currentX = initX;
    let currentY = initY;
    let moved = false;

    setIsDragging(true);

    const handleMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        moved = true;
      }
      currentX = Math.max(10, Math.min(maxX, initX + dx));
      currentY = Math.max(10, Math.min(maxY, initY + dy));
      setPos({ x: currentX, y: currentY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);

      if (moved) {
        let finalX = currentX;
        let finalY = currentY;
        if (gridSnap) {
          finalX = Math.round(finalX / 20) * 20;
          finalY = Math.round(finalY / 20) * 20;
        }
        finalX = Math.max(10, Math.min(maxX, finalX));
        finalY = Math.max(10, Math.min(maxY, finalY));
        const finalPos = { x: finalX, y: finalY };
        setPos(finalPos);
        onPositionChange(finalPos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const rawHours = now.getHours();
  const displayHours = is24Hour ? rawHours : rawHours % 12 || 12;
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeStr = `${pad(displayHours)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const weekdayStr = WEEKDAYS[now.getDay()];
  const amPmLabel = rawHours >= 12 ? 'PM' : 'AM';

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: isDragging ? 45 : 18,
      }}
      className={`absolute w-[208px] bg-[#c0c0c0] p-1.5 pixel-box-raised select-none ${
        isDragging ? 'cursor-grabbing scale-[1.02]' : 'cursor-grab'
      } transition-transform duration-75`}
      title="按住可拖拽调整数字时钟位置"
    >
      {/* Top Retro Desklet Bar */}
      <div className="flex items-center justify-between px-1.5 py-0.5 mb-1 bg-[#000080] text-white text-[10px] font-mono">
        <span className="font-bold tracking-wider">数字时钟</span>
        <button
          type="button"
          onClick={() => setIs24Hour((prev) => !prev)}
          className="px-1 bg-[#c0c0c0] text-black font-bold border border-black text-[9px] leading-tight hover:bg-amber-200"
          title="切换 12/24 小时制"
        >
          {is24Hour ? '24H' : '12H'}
        </button>
      </div>

      {/* LCD Screen */}
      <div className="bg-[#111c16] text-[#86efac] px-2.5 py-2 pixel-box-sunken border border-black flex flex-col items-center justify-center">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-xl font-bold tracking-widest font-mono tabular-nums"
            style={{ textShadow: '0 0 6px rgba(134, 239, 172, 0.35)' }}
          >
            {timeStr}
          </span>
          {!is24Hour && (
            <span className="text-[10px] font-mono font-bold text-amber-300">
              {amPmLabel}
            </span>
          )}
        </div>
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#4ade80]/85 mt-1 pt-1 border-t border-[#86efac]/20 tabular-nums">
          <span>{dateStr}</span>
          <span>{weekdayStr}</span>
        </div>
      </div>
    </div>
  );
};

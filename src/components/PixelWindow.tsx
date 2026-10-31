import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { PixelIcon } from './PixelIcon';

interface PixelWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  icon?: string;
  zIndex?: number;
  onFocus?: () => void;
  className?: string;
}

export const PixelWindow: React.FC<PixelWindowProps> = ({
  title,
  isOpen,
  onClose,
  children,
  initialPosition = { x: 120, y: 80 },
  initialSize = { width: 560, height: 460 },
  icon = 'note',
  zIndex = 50,
  onFocus,
  className = '',
}) => {
  const [pos, setPos] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: initialPosition.x,
    initY: initialPosition.y,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(10, Math.min(window.innerWidth - 120, dragRef.current.initX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 80, dragRef.current.initY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus?.();
    if (isMaximized) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
    };
    setIsDragging(true);
  };

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        left: isMaximized ? 12 : `${pos.x}px`,
        top: isMaximized ? 48 : `${pos.y}px`,
        width: isMaximized ? 'calc(100vw - 24px)' : `${initialSize.width}px`,
        height: isMaximized ? 'calc(100vh - 64px)' : `${initialSize.height}px`,
      }}
      className={`fixed flex flex-col bg-[#c0c0c0] pixel-box-raised border-2 border-black ${className}`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-2 py-1.5 bg-[#000080] text-white select-none cursor-move shrink-0 border-b border-black"
        style={{
          background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <PixelIcon name={icon} size={16} />
          <span className="font-bold text-xs tracking-wider truncate font-mono">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Maximize Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] text-black text-xs font-bold pixel-btn active:translate-y-0.5"
            title={isMaximized ? '还原' : '最大化'}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] hover:bg-[#ef4444] hover:text-white text-black text-xs font-bold pixel-btn active:translate-y-0.5"
            title="关闭窗口"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-[#e5e5e5] p-3 text-black">
        {children}
      </div>
    </div>
  );
};

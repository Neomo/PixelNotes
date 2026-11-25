import React from 'react';
import { NoteColor, NoteTexture } from '../types';

export const NOTE_COLOR_MAP: Record<
  NoteColor,
  { bg: string; border: string; text: string; headerBg: string; label: string }
> = {
  yellow: { bg: '#fef08a', border: '#eab308', text: '#713f12', headerBg: '#fde047', label: '暖黄' },
  green: { bg: '#bbf7d0', border: '#22c55e', text: '#14532d', headerBg: '#86efac', label: '薄荷绿' },
  blue: { bg: '#bae6fd', border: '#0ea5e9', text: '#0c4a6e', headerBg: '#7dd3fc', label: '天蓝' },
  pink: { bg: '#fbcfe8', border: '#ec4899', text: '#831843', headerBg: '#f9a8d4', label: '樱粉' },
  purple: { bg: '#ddd6fe', border: '#8b5cf6', text: '#4c1d95', headerBg: '#c4b5fd', label: '香芋紫' },
  beige: { bg: '#f5ebe0', border: '#d5bdaf', text: '#4a3e3d', headerBg: '#e6ccb2', label: '复古米' },
  dark: { bg: '#1e293b', border: '#475569', text: '#f1f5f9', headerBg: '#334155', label: '暗夜灰' },
};

export const NOTE_TEXTURE_OPTIONS: { key: NoteTexture; label: string }[] = [
  { key: 'none', label: '纯色纸张' },
  { key: 'grid', label: '像素网格' },
  { key: 'stripes', label: '复古条纹' },
  { key: 'dots', label: '像素波点' },
  { key: 'checker', label: '棋盘像素' },
];

export function getNoteTextureStyle(
  texture: NoteTexture | undefined,
  color: NoteColor
): React.CSSProperties {
  const isDark = color === 'dark';
  const patternInk = isDark ? 'rgba(255, 255, 255, 0.13)' : 'rgba(0, 0, 0, 0.10)';
  const subtleInk = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  switch (texture) {
    case 'grid':
      return {
        backgroundImage: `linear-gradient(to right, ${patternInk} 1px, transparent 1px), linear-gradient(to bottom, ${patternInk} 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      };
    case 'stripes':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${patternInk} 10px, ${patternInk} 12px)`,
      };
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${patternInk} 1.5px, transparent 1.5px)`,
        backgroundSize: '10px 10px',
      };
    case 'checker':
      return {
        backgroundImage: `linear-gradient(45deg, ${subtleInk} 25%, transparent 25%), linear-gradient(-45deg, ${subtleInk} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${subtleInk} 75%), linear-gradient(-45deg, transparent 75%, ${subtleInk} 75%)`,
        backgroundSize: '12px 12px',
        backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
      };
    case 'none':
    default:
      return {};
  }
}

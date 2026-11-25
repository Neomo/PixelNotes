export type NoteColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'beige' | 'dark';

export type NoteTexture = 'none' | 'grid' | 'stripes' | 'dots' | 'checker';

export type ViewMode = 'today' | 'global' | 'timeline' | 'random';

export type WallpaperTheme = 'teal' | 'sunset' | 'night' | 'gameboy' | 'mac';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  texture?: NoteTexture;
  folderId: string | null;
  tagIds: string[];
  isPinned: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  position: { x: number; y: number };
  zIndex?: number;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface DesktopSettings {
  viewMode: ViewMode;
  wallpaper: WallpaperTheme;
  folderIconSize: 'sm' | 'md' | 'lg';
  soundEnabled: boolean;
  crtScanline: boolean;
  gridSnap: boolean;
  clockPosition?: { x: number; y: number };
}

export interface BackupData {
  version: string;
  exportedAt: number;
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  settings?: DesktopSettings;
}

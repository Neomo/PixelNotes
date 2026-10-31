import React from 'react';

interface PixelIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 20,
  className = '',
  color,
}) => {
  switch (name) {
    case 'folder':
    case 'folder-work':
    case 'folder-life':
    case 'folder-study':
    case 'folder-archive':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`pixel-icon ${className}`}>
          {/* Pixel Folder Base */}
          <path d="M2 5h7l2 2h11v13H2V5z" fill={color || '#f59e0b'} />
          <path d="M2 5h7v2H2z" fill="#ffffff" fillOpacity="0.4" />
          <path d="M2 7h20v11H2z" fill={color || '#d97706'} />
          {/* Folder tabs and pixel outline */}
          <path
            d="M2 4h8v2h12v15H2V4zM1 3v18h22V6h-11l-2-2H1z"
            fill="#000000"
          />
          {/* Inner shadow line */}
          <rect x="4" y="9" width="16" height="2" fill="#ffffff" fillOpacity="0.3" />
        </svg>
      );

    case 'note':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="18" height="18" fill={color || '#fef08a'} />
          <path d="M3 2h18v1H3zM3 21h18v1H3zM2 3h1v18H2zM21 3h1v18h-1z" fill="#000000" />
          {/* Note lines */}
          <rect x="6" y="7" width="10" height="2" fill="#000000" fillOpacity="0.4" />
          <rect x="6" y="11" width="12" height="2" fill="#000000" fillOpacity="0.4" />
          <rect x="6" y="15" width="8" height="2" fill="#000000" fillOpacity="0.4" />
        </svg>
      );

    case 'pin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="11" y="2" width="2" height="4" fill="#ef4444" />
          <rect x="8" y="6" width="8" height="5" fill="#ef4444" />
          <rect x="6" y="11" width="12" height="3" fill="#dc2626" />
          <rect x="11" y="14" width="2" height="8" fill="#64748b" />
          {/* Pixel outline */}
          <path d="M10 2h4v4h3v5h2v3h-7v8h-2v-8H3v-3h2V6h5V2zm1 2v2h2V4h-2z" fill="#000000" />
        </svg>
      );

    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2h2v4h4v2h2v4h-2v2h-2v2h2v4h-2v2h-4v-2h-2v2H6v-2H4v-4h2v-2h-2V8h2V6h4V2h2z"
            fill={color || '#f59e0b'}
          />
          <path
            d="M11 2h2v4h4v2h2v4h-2v2h-2v2h2v4h-2v2h-4v-2h-2v2H6v-2H4v-4h2v-2h-2V8h2V6h4V2zm1 2h-1v2H7v2H5v4h2v2h2v2h-2v4h2v2h4v-2h2v2h4v-2h2v-4h-2v-2h2V8h-2V6h-4V4h-2z"
            fill="#000000"
          />
          <rect x="10" y="6" width="2" height="2" fill="#ffffff" />
        </svg>
      );

    case 'trash':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="5" y="8" width="14" height="13" fill={color || '#94a3b8'} />
          <rect x="3" y="5" width="18" height="3" fill="#cbd5e1" />
          <rect x="9" y="2" width="6" height="3" fill="#cbd5e1" />
          {/* Bin lines */}
          <rect x="8" y="10" width="2" height="8" fill="#000000" fillOpacity="0.4" />
          <rect x="11" y="10" width="2" height="8" fill="#000000" fillOpacity="0.4" />
          <rect x="14" y="10" width="2" height="8" fill="#000000" fillOpacity="0.4" />
          {/* Black outline */}
          <path
            d="M8 2h8v3h5v4h-1v13H4V9H3V5h5V2zm1 2v1h6V4H9zM5 7v1h14V7H5zm1 3v10h12V10H6z"
            fill="#000000"
          />
        </svg>
      );

    case 'search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="4" width="10" height="10" fill="#93c5fd" />
          <rect x="6" y="6" width="2" height="2" fill="#ffffff" />
          <path
            d="M4 3h10v2H4V3zm10 2h2v8h-2V5zm-2 8h-8v-2h8v2zm-8-2H2V5h2v6zm11 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v3h-3v-2h1v-1z"
            fill="#000000"
          />
        </svg>
      );

    case 'archive':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="18" height="6" fill="#fbbf24" />
          <rect x="4" y="9" width="16" height="12" fill="#d97706" />
          <rect x="9" y="12" width="6" height="3" fill="#fef3c7" />
          {/* Outline */}
          <path
            d="M2 2h20v8h-1v12H3V10H2V2zm2 2v4h16V4H4zm1 6v10h14V10H5zm4 2h6v3H9v-3z"
            fill="#000000"
          />
        </svg>
      );

    case 'settings':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="9" y="2" width="6" height="20" fill="#94a3b8" />
          <rect x="2" y="9" width="20" height="6" fill="#94a3b8" />
          <rect x="5" y="5" width="14" height="14" fill="#cbd5e1" />
          <rect x="8" y="8" width="8" height="8" fill="#475569" />
          {/* Pixel outline */}
          <path
            d="M8 2h8v2H8V2zm0 18h8v2H8v-2zM2 8h2v8H2V8zm18 0h2v8h-2V8zm-6 2h2v4h-2v-4zm-4 0h2v4h-2v-4z"
            fill="#000000"
          />
        </svg>
      );

    case 'tag':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 4h9l8 8-8 8H4V4z" fill={color || '#3b82f6'} />
          <rect x="7" y="7" width="3" height="3" fill="#ffffff" />
          <path d="M3 3h11l8 8v1l-8 8v1H3V3zm2 2v14h8l7-7-7-7H5z" fill="#000000" />
        </svg>
      );

    case 'close':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
          <path
            d="M2 2h2v2H2V2zm2 2h2v2H4V4zm2 2h4v4H6V6zm4-2h2v2h-2V4zm2-2h2v2h-2V2zm0 10h-2v-2h2v2zm-2 2H8v-2h2v2zm-4 0H4v-2h2v2zm-2-2H2v-2h2v2z"
            fill="#000000"
          />
        </svg>
      );

    case 'plus':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
          <rect x="6" y="2" width="4" height="12" fill="#000000" />
          <rect x="2" y="6" width="12" height="4" fill="#000000" />
        </svg>
      );

    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
          <rect x="11" y="3" width="2" height="3" fill="#15803d" />
          <rect x="9" y="6" width="2" height="3" fill="#15803d" />
          <rect x="7" y="9" width="2" height="3" fill="#15803d" />
          <rect x="5" y="8" width="2" height="2" fill="#15803d" />
          <rect x="3" y="6" width="2" height="2" fill="#15803d" />
        </svg>
      );

    case 'sound-on':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="8" width="4" height="8" fill="#000000" />
          <path d="M7 8l6-5v18l-6-5H3V8h4z" fill="#000000" />
          <rect x="16" y="7" width="2" height="10" fill="#000000" />
          <rect x="19" y="4" width="2" height="16" fill="#000000" />
        </svg>
      );

    case 'sound-off':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="8" width="4" height="8" fill="#000000" />
          <path d="M7 8l6-5v18l-6-5H3V8h4z" fill="#000000" />
          <path d="M16 8l5 8m0-8l-5 8" stroke="#ef4444" strokeWidth="2" />
        </svg>
      );

    case 'calendar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="5" width="18" height="16" fill="#ffffff" />
          <rect x="3" y="5" width="18" height="5" fill="#ef4444" />
          <rect x="6" y="2" width="2" height="5" fill="#000000" />
          <rect x="16" y="2" width="2" height="5" fill="#000000" />
          <path d="M2 4h20v18H2V4zm2 2v3h16V6H4zm0 5v9h16v-9H4z" fill="#000000" />
          <rect x="7" y="13" width="2" height="2" fill="#000000" />
          <rect x="11" y="13" width="2" height="2" fill="#000000" />
          <rect x="15" y="13" width="2" height="2" fill="#000000" />
        </svg>
      );

    case 'dice':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="18" height="18" fill="#f8fafc" />
          <path d="M2 2h20v20H2V2zm2 2v16h16V4H4z" fill="#000000" />
          <rect x="7" y="7" width="2" height="2" fill="#000000" />
          <rect x="15" y="7" width="2" height="2" fill="#000000" />
          <rect x="11" y="11" width="2" height="2" fill="#ef4444" />
          <rect x="7" y="15" width="2" height="2" fill="#000000" />
          <rect x="15" y="15" width="2" height="2" fill="#000000" />
        </svg>
      );

    case 'grid':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="8" height="8" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
          <rect x="13" y="3" width="8" height="8" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
          <rect x="3" y="13" width="8" height="8" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
          <rect x="13" y="13" width="8" height="8" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="4" width="16" height="16" fill="#cbd5e1" stroke="#000" strokeWidth="2" />
        </svg>
      );
  }
};

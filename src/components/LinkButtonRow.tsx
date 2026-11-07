import React, { useState } from 'react';
import { ArrowUpRight, ArrowUp, ArrowDown, Copy, Check, Edit2, Star, Sparkles } from 'lucide-react';
import { AppLink } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { soundFx } from '../utils/audio';

interface LinkButtonRowProps {
  link: AppLink;
  index: number;
  onEdit: (link: AppLink) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPreview?: (link: AppLink) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

// Preset glossy 3D gradient themes matching the user screenshot
const glossyPresets: {
  bgGradient: string;
  glowColor: string;
  borderColor: string;
}[] = [
  // 1: Royal Sapphire Blue (DATA MURID)
  {
    bgGradient: 'from-[#1746c9] via-[#2563eb] to-[#123187]',
    glowColor: 'shadow-blue-500/25',
    borderColor: 'border-blue-400/40',
  },
  // 2: Emerald Teal (REKOD KEHADIRAN KELAS KESENIAN)
  {
    bgGradient: 'from-[#047857] via-[#059669] to-[#044c36]',
    glowColor: 'shadow-emerald-500/25',
    borderColor: 'border-emerald-400/40',
  },
  // 3: Warm Amber / Gold / Orange (PENGURUSAN ASET)
  {
    bgGradient: 'from-[#b45309] via-[#ea580c] to-[#7c2d12]',
    glowColor: 'shadow-orange-500/25',
    borderColor: 'border-orange-400/40',
  },
  // 4: Deep Cerulean Cyan (PENGURUSAN ASRAMA)
  {
    bgGradient: 'from-[#0e7490] via-[#0891b2] to-[#164e63]',
    glowColor: 'shadow-cyan-500/25',
    borderColor: 'border-cyan-400/40',
  },
  // 5: Crimson Ruby / Rose (PENGURUSAN AKTIVITI DAN PROGRAM)
  {
    bgGradient: 'from-[#be123c] via-[#e11d48] to-[#700c25]',
    glowColor: 'shadow-rose-500/25',
    borderColor: 'border-rose-400/40',
  },
  // 6: Purple Violet (ERPH)
  {
    bgGradient: 'from-[#6d28d9] via-[#8b5cf6] to-[#431478]',
    glowColor: 'shadow-purple-500/25',
    borderColor: 'border-purple-400/40',
  },
  // 7: Cobalt Blue (PLC)
  {
    bgGradient: 'from-[#1d4ed8] via-[#3b82f6] to-[#172554]',
    glowColor: 'shadow-indigo-500/25',
    borderColor: 'border-indigo-400/40',
  },
  // 8: Indigo Magenta (SK@S & others)
  {
    bgGradient: 'from-[#4338ca] via-[#6366f1] to-[#2e1065]',
    glowColor: 'shadow-indigo-500/25',
    borderColor: 'border-indigo-400/40',
  },
];

// Fallback color mapping based on link.color
const colorToPresetIdx: Record<AppLink['color'], number> = {
  blue: 0,
  emerald: 1,
  amber: 2,
  cyan: 3,
  rose: 4,
  purple: 5,
  indigo: 6,
  orange: 7,
};

export const LinkButtonRow: React.FC<LinkButtonRowProps> = ({
  link,
  index,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenPreview,
  onMoveUp,
  onMoveDown,
}) => {
  const [copied, setCopied] = useState(false);

  // Pick preset by index or link color
  const presetIdx = (index - 1) >= 0 && (index - 1) < glossyPresets.length
    ? (index - 1) % glossyPresets.length
    : colorToPresetIdx[link.color] ?? 0;

  const currentTheme = glossyPresets[presetIdx];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    soundFx.playOpen();
    window.open(link.url, link.target || '_blank', 'noopener,noreferrer');
  };

  // Use the actual user-configured title, styled in bold uppercase
  const displayTitle = (link.title || '').trim().toUpperCase();

  return (
    <div
      onClick={handleLaunch}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLaunch();
        }
      }}
      className={`group relative overflow-hidden w-full rounded-xl py-1.5 px-2.5 sm:py-2 sm:px-3.5 bg-gradient-to-r ${currentTheme.bgGradient} border ${currentTheme.borderColor} shadow-sm ${currentTheme.glowColor} hover:brightness-110 active:scale-[0.99] transition-all duration-150 cursor-pointer select-none`}
    >
      {/* 3D Glossy Specular Highlight on top half of pill */}
      <div className="absolute inset-x-0 top-0 h-[46%] rounded-t-xl bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />

      {/* Subtle bottom shadow line inside the pill for 3D depth */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/25 pointer-events-none rounded-b-xl" />

      {/* Button Content Row */}
      <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Section: Number Badge + Icon + Bold Uppercase Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          {/* 1. Dark Number Badge [ 1 ] */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-white text-[11px] sm:text-xs shrink-0 shadow-inner">
            {index}
          </div>

          {/* 2. Frosted Icon Badge */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <DynamicIcon name={link.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>

          {/* 3. Uppercase Bold Title */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] truncate leading-tight">
                {displayTitle}
              </h3>
              {link.subCategory && (
                <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold bg-black/40 text-amber-200 border border-amber-300/40 rounded-sm leading-tight shrink-0 shadow-2xs">
                  {link.subCategory}
                </span>
              )}
            </div>
            {/* Optional subtle subtitle/category if user added custom links */}
            {link.category && link.category !== 'Semua' && (
              <span className="hidden lg:inline-block text-[9px] text-white/75 font-medium tracking-normal lowercase">
                • {link.category}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Actions & Buttons */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow Up / Down */}
          {onMoveUp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              title="Alih Naik (▲)"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/15 hover:bg-white/30 active:scale-90 border border-white/25 flex items-center justify-center text-white transition-all backdrop-blur-xs shadow-xs"
            >
              <ArrowUp className="w-3 h-3 text-white/90" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              title="Alih Turun (▼)"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/15 hover:bg-white/30 active:scale-90 border border-white/25 flex items-center justify-center text-white transition-all backdrop-blur-xs shadow-xs"
            >
              <ArrowDown className="w-3 h-3 text-white/90" />
            </button>
          )}

          {/* Button 0: Toggle Favorite Star */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick();
              onToggleFavorite(link.id);
            }}
            title={link.isFavorite ? 'Keluarkan daripada Link Favourite' : 'Tambah ke Link Favourite (⭐)'}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center transition-all backdrop-blur-xs shadow-xs active:scale-90 ${
              link.isFavorite
                ? 'bg-amber-400/35 border-amber-300 text-amber-200 shadow-amber-500/20'
                : 'bg-white/15 hover:bg-white/30 border-white/25 text-white/75 hover:text-white'
            }`}
          >
            <Star className={`w-3 h-3 ${link.isFavorite ? 'fill-amber-300 text-amber-300' : ''}`} />
          </button>

          {/* Button 1: Copy URL */}
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Pautan Disalin!' : 'Salin Pautan URL'}
            className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/15 hover:bg-white/30 active:scale-90 border border-white/25 flex items-center justify-center text-white transition-all backdrop-blur-xs shadow-xs"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-200 stroke-[2.5]" />
            ) : (
              <Copy className="w-3 h-3 text-white/90" />
            )}
            {copied && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-black/85 text-[9px] text-white rounded font-sans whitespace-nowrap shadow">
                Disalin!
              </span>
            )}
          </button>

          {/* Button 2: Edit Link */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick();
              onEdit(link);
            }}
            title="Kemaskini Pautan"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/15 hover:bg-white/30 active:scale-90 border border-white/25 flex items-center justify-center text-white transition-all backdrop-blur-xs shadow-xs"
          >
            <Edit2 className="w-3 h-3 text-white/90" />
          </button>

          {/* Button 3: Direct Launch Arrow ↗ */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLaunch();
            }}
            title="Buka Aplikasi (Tab Baharu)"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 hover:bg-white/35 active:scale-90 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-xs shadow-xs group-hover:bg-white/25"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

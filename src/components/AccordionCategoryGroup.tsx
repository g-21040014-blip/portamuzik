import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Star,
} from 'lucide-react';
import { AppLink } from '../types';
import { soundFx } from '../utils/audio';
import { getCategoryIcon } from '../utils/categoryIcons';

interface AccordionCategoryGroupProps {
  category: string;
  links: AppLink[];
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (link: AppLink) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPreview?: (link: AppLink) => void;
  onMoveLink?: (linkId: string, direction: 'up' | 'down') => void;
}

// Vibrant solid circular arrow colors matching the user screenshot
const circularArrowColors = [
  'bg-[#ea580c] hover:bg-[#c2410c]', // 1: Orange
  'bg-[#06b6d4] hover:bg-[#0891b2]', // 2: Cyan
  'bg-[#2563eb] hover:bg-[#1d4ed8]', // 3: Royal Blue
  'bg-[#dc2626] hover:bg-[#b91c1c]', // 4: Crimson Red
  'bg-[#16a34a] hover:bg-[#15803d]', // 5: Green
  'bg-[#8b5cf6] hover:bg-[#7c3aed]', // 6: Violet Purple
  'bg-[#059669] hover:bg-[#047857]', // 7: Emerald
  'bg-[#d97706] hover:bg-[#b45309]', // 8: Amber
];

const colorNameToBg: Record<AppLink['color'], string> = {
  orange: 'bg-[#ea580c] hover:bg-[#c2410c]',
  cyan: 'bg-[#06b6d4] hover:bg-[#0891b2]',
  blue: 'bg-[#2563eb] hover:bg-[#1d4ed8]',
  rose: 'bg-[#dc2626] hover:bg-[#b91c1c]',
  emerald: 'bg-[#16a34a] hover:bg-[#15803d]',
  purple: 'bg-[#8b5cf6] hover:bg-[#7c3aed]',
  amber: 'bg-[#d97706] hover:bg-[#b45309]',
  indigo: 'bg-[#4f46e5] hover:bg-[#4338ca]',
};

export const AccordionCategoryGroup: React.FC<AccordionCategoryGroupProps> = ({
  category,
  links,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenPreview,
  onMoveLink,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const CatIcon = getCategoryIcon(category);

  const handleCopy = (e: React.MouseEvent, link: AppLink) => {
    e.stopPropagation();
    soundFx.playClick();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunch = (link: AppLink) => {
    soundFx.playOpen();
    window.open(link.url, link.target || '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      {/* Category Accordion Header Row */}
      <div
        onClick={() => {
          soundFx.playClick();
          onToggle();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            soundFx.playClick();
            onToggle();
          }
        }}
        className="w-full flex items-center justify-between py-3.5 px-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 rounded-xl cursor-pointer select-none transition-colors group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/20 transition-colors">
            <CatIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {category}
          </h2>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {links.length}
          </span>
        </div>

        {/* Circular Dark Chevron Toggle Button - Exactly matching screenshot */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.playClick();
            onToggle();
          }}
          title={isOpen ? 'Kuncupkan Kategori' : 'Kembangkan Kategori'}
          className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-teal-400 flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90"
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Accordion Expandable Content with Left Guide Bar */}
      {isOpen && (
        <div className="pl-4 sm:pl-6 pb-4 pt-1 animate-fade-in">
          {/* Vertical Guide Line on the Left - Royal Greenwich Style */}
          <div className="border-l-2 border-slate-900 dark:border-slate-400 pl-4 sm:pl-5 space-y-1.5">
            {links.map((link, idx) => {
              const arrowBg =
                colorNameToBg[link.color] ||
                circularArrowColors[idx % circularArrowColors.length];
              const isCopied = copiedId === link.id;

              return (
                <div
                  key={link.id}
                  onClick={() => handleLaunch(link)}
                  className="group flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Left: Link Title & Description */}
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 underline-offset-4 group-hover:underline truncate">
                        {link.title}
                      </h3>
                      {link.subCategory && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          {link.subCategory}
                        </span>
                      )}
                      {link.badgeText && (
                        <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          {link.badgeText}
                        </span>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                        {link.description}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions & Circular Solid Arrow Button */}
                  <div
                    className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Reorder Up/Down Arrow Buttons */}
                    {onMoveLink && (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => onMoveLink(link.id, 'up')}
                          disabled={idx === 0}
                          title="Alih Naik (▲)"
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveLink(link.id, 'down')}
                          disabled={idx === links.length - 1}
                          title="Alih Turun (▼)"
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Toggle Favorite Star Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onToggleFavorite(link.id);
                      }}
                      title={link.isFavorite ? 'Keluarkan daripada Link Favourite' : 'Tambah ke Link Favourite (⭐)'}
                      className={`p-1.5 rounded-md transition-colors ${
                        link.isFavorite
                          ? 'text-amber-500 fill-amber-500 hover:text-amber-600 dark:text-amber-400'
                          : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 opacity-60 group-hover:opacity-100'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${link.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>

                    {/* Copy URL */}
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, link)}
                      title={isCopied ? 'Disalin!' : 'Salin URL'}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Edit Link */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onEdit(link);
                      }}
                      title="Edit Pautan"
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Vibrant Solid Circular Arrow Button - Exactly like screenshot */}
                    <button
                      type="button"
                      onClick={() => handleLaunch(link)}
                      title="Buka Aplikasi"
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${arrowBg} text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 group-hover:scale-105`}
                    >
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Dark Capsule Badge - Exactly like the screenshot */}
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold tracking-tight shadow-xs">
                {category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowRight, ArrowUp, ArrowDown, Copy, Check, Edit2, ExternalLink, Star } from 'lucide-react';
import { AppLink } from '../types';
import { soundFx } from '../utils/audio';

interface TopFeaturedLinksProps {
  links: AppLink[];
  onEdit: (link: AppLink) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMoveLink?: (linkId: string, direction: 'up' | 'down') => void;
}

const circularColors = [
  'bg-[#ea580c] hover:bg-[#c2410c]', // Orange
  'bg-[#06b6d4] hover:bg-[#0891b2]', // Cyan
  'bg-[#2563eb] hover:bg-[#1d4ed8]', // Royal Blue
  'bg-[#dc2626] hover:bg-[#b91c1c]', // Crimson Red
  'bg-[#16a34a] hover:bg-[#15803d]', // Green
  'bg-[#8b5cf6] hover:bg-[#7c3aed]', // Violet
  'bg-[#d97706] hover:bg-[#b45309]', // Amber
];

export const TopFeaturedLinks: React.FC<TopFeaturedLinksProps> = ({
  links,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMoveLink,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!links || links.length === 0) return null;

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
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 sm:p-4 shadow-xs">
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {links.map((link, idx) => {
          const arrowBg = circularColors[idx % circularColors.length];
          const isCopied = copiedId === link.id;

          return (
            <div
              key={link.id}
              onClick={() => handleLaunch(link)}
              className="group flex items-center justify-between py-3 px-2 sm:px-3 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl cursor-pointer transition-colors"
            >
              {/* Left: Title & Tag */}
              <div className="min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {link.title}
                  </h3>
                  {link.badgeText && (
                    <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
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

              {/* Right: Quick Tools & Solid Circular Arrow Button */}
              <div
                className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Reorder Arrow Buttons */}
                {onMoveLink && (
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => onMoveLink(link.id, 'up')}
                      disabled={idx === 0}
                      title="Alih Naik (▲)"
                      className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-750 disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveLink(link.id, 'down')}
                      disabled={idx === links.length - 1}
                      title="Alih Turun (▼)"
                      className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-750 disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Favorite Star Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onToggleFavorite(link.id);
                  }}
                  title="Pautan Favourite (Klik untuk keluarkan daripada Favourite)"
                  className="p-1.5 text-amber-500 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-md transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCopy(e, link)}
                  title={isCopied ? 'Disalin!' : 'Salin URL'}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onEdit(link);
                  }}
                  title="Kemaskini Pautan"
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Circular Solid Color Arrow Button (Orange, Cyan, Blue, Red, Green...) */}
                <div
                  className={`w-8 h-8 rounded-full ${arrowBg} text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 group-hover:scale-105`}
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

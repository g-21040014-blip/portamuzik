import React, { useState } from 'react';
import { ExternalLink, Star, Copy, Check, Edit2, Trash2 } from 'lucide-react';
import { AppLink } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { soundFx } from '../utils/audio';

interface LinkGridCardProps {
  link: AppLink;
  onEdit: (link: AppLink) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const colorStyles: Record<AppLink['color'], { bg: string; text: string; border: string }> = {
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'hover:border-amber-300 dark:hover:border-amber-500/30' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200/60 dark:border-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'hover:border-blue-300 dark:hover:border-blue-500/30' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-300 dark:hover:border-emerald-500/30' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200/60 dark:border-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'hover:border-purple-300 dark:hover:border-purple-500/30' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400', border: 'hover:border-rose-300 dark:hover:border-rose-500/30' },
  cyan: { bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200/60 dark:border-teal-500/20', text: 'text-teal-600 dark:text-teal-400', border: 'hover:border-teal-300 dark:hover:border-teal-500/30' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/60 dark:border-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'hover:border-indigo-300 dark:hover:border-indigo-500/30' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200/60 dark:border-orange-500/20', text: 'text-orange-600 dark:text-orange-400', border: 'hover:border-orange-300 dark:hover:border-orange-500/30' },
};

export const LinkGridCard: React.FC<LinkGridCardProps> = ({
  link,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const style = colorStyles[link.color] || colorStyles.blue;

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

  const cleanDomain = (() => {
    try {
      const u = new URL(link.url);
      return u.hostname.replace('www.', '');
    } catch {
      return link.url.replace(/^https?:\/\//, '').split('/')[0] || 'pautan-luar';
    }
  })();

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
      className={`group relative flex flex-col justify-between p-4.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-850/70 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm ${style.border}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${style.bg}`}>
            <DynamicIcon name={link.iconName} className={`w-5 h-5 ${style.text}`} />
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onToggleFavorite(link.id);
              }}
              title={link.isFavorite ? 'Buang daripada Kegemaran' : 'Tambah ke Kegemaran'}
              className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                link.isFavorite ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Star className={`w-4 h-4 ${link.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              title="Salin Pautan"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium">{link.category}</span>
          {link.subCategory && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 dark:text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.2 rounded text-[10px] border border-amber-500/20">
                {link.subCategory}
              </span>
            </>
          )}
          {link.badgeText && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-teal-600 dark:text-teal-400 font-medium">{link.badgeText}</span>
            </>
          )}
        </div>

        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5 line-clamp-1">
          {link.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {link.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
          {cleanDomain}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(link)}
            title="Kemaskini"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(link.id)}
            title="Padam"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            <span>Buka</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

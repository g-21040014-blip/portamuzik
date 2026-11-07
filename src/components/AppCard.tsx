import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Pin, 
  ChevronDown, 
  ChevronUp, 
  Link2,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { AppModule } from '../types';
import { IconRenderer } from './IconRenderer';

interface AppCardProps {
  module: AppModule;
  onEdit: (module: AppModule) => void;
  onTogglePin: (id: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ module, onEdit, onTogglePin }) => {
  const [copied, setCopied] = useState(false);
  const [showSubLinks, setShowSubLinks] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(module.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPlaceholderUrl = module.url.includes('your-') || module.url === '#' || !module.url.startsWith('http');

  const getColorTheme = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
          iconBg: 'bg-indigo-500/15 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white',
          borderHover: 'hover:border-indigo-500/50',
          glow: 'from-indigo-600/10 to-transparent',
          btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white'
        };
      case 'emerald':
        return {
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
          iconBg: 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
          borderHover: 'hover:border-emerald-500/50',
          glow: 'from-emerald-600/10 to-transparent',
          btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white'
        };
      case 'amber':
        return {
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
          iconBg: 'bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
          borderHover: 'hover:border-amber-500/50',
          glow: 'from-amber-600/10 to-transparent',
          btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
        };
      case 'sky':
        return {
          badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
          iconBg: 'bg-sky-500/15 text-sky-400 group-hover:bg-sky-500 group-hover:text-white',
          borderHover: 'hover:border-sky-500/50',
          glow: 'from-sky-600/10 to-transparent',
          btnPrimary: 'bg-sky-600 hover:bg-sky-500 text-white'
        };
      case 'rose':
        return {
          badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
          iconBg: 'bg-rose-500/15 text-rose-400 group-hover:bg-rose-500 group-hover:text-white',
          borderHover: 'hover:border-rose-500/50',
          glow: 'from-rose-600/10 to-transparent',
          btnPrimary: 'bg-rose-600 hover:bg-rose-500 text-white'
        };
      case 'violet':
        return {
          badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
          iconBg: 'bg-violet-500/15 text-violet-400 group-hover:bg-violet-500 group-hover:text-white',
          borderHover: 'hover:border-violet-500/50',
          glow: 'from-violet-600/10 to-transparent',
          btnPrimary: 'bg-violet-600 hover:bg-violet-500 text-white'
        };
      default:
        return {
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
          iconBg: 'bg-blue-500/15 text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
          borderHover: 'hover:border-blue-500/50',
          glow: 'from-blue-600/10 to-transparent',
          btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white'
        };
    }
  };

  const theme = getColorTheme(module.accentColor);

  return (
    <div 
      id={`card-module-${module.id}`}
      className={`group relative rounded-2xl bg-slate-900/90 border border-slate-800 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/20 ${theme.borderHover} hover:shadow-2xl hover:-translate-y-1`}
    >
      {/* Top subtle gradient ambient effect */}
      <div className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b ${theme.glow} pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity`}></div>

      {/* Card Header & Content */}
      <div className="p-5 relative z-10">
        {/* Top meta strip */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              #{String(module.orderNumber).padStart(2, '0')}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
              {module.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(module.id)}
              title={module.isPinned ? 'Nyah-pin aplikasi' : 'Pin aplikasi ke atas'}
              className={`p-1.5 rounded-lg transition-colors ${
                module.isPinned 
                  ? 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${module.isPinned ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onEdit(module)}
              id={`btn-edit-${module.id}`}
              title="Kemas kini pautan & maklumat modul ini"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${theme.iconBg} shadow-inner`}>
            <IconRenderer name={module.icon} className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug truncate group-hover:text-amber-300 transition-colors">
              {module.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-medium text-slate-400">
                {module.badge}
              </span>
              {isPlaceholderUrl && (
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300/90 border border-amber-500/20">
                  Ubah URL
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-3 mb-4 font-normal">
          {module.description}
        </p>

        {/* Notes (if available) */}
        {module.notes && (
          <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 mb-3 text-[11px] text-slate-400 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{module.notes}</span>
          </div>
        )}

        {/* Sub-links section (if present) */}
        {module.subLinks && module.subLinks.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-800/70">
            <button
              onClick={() => setShowSubLinks(!showSubLinks)}
              className="w-full flex items-center justify-between text-[11px] font-medium text-slate-400 hover:text-slate-200 py-1 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Pautan Pantas Terperinci ({module.subLinks.length})</span>
              </span>
              {showSubLinks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSubLinks && (
              <div className="mt-2 space-y-1.5 pl-1">
                {module.subLinks.map((sub) => (
                  <a
                    key={sub.id}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800/60 text-xs text-slate-300 hover:text-amber-300 transition-all group/sub"
                  >
                    <span className="truncate pr-2">{sub.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/sub:text-amber-300 flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 relative z-10 flex items-center gap-2">
        <a
          href={module.url}
          target="_blank"
          rel="noopener noreferrer"
          id={`btn-open-${module.id}`}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 ${theme.btnPrimary}`}
        >
          <span>Buka Aplikasi</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleCopy}
          id={`btn-copy-${module.id}`}
          title="Salin pautan aplikasi"
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex-shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onEdit(module)}
          title="Tukar URL atau nama modul ini"
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex-shrink-0"
        >
          <Link2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

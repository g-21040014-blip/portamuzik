import React from 'react';
import { X, ExternalLink, Globe, AlertCircle } from 'lucide-react';
import { AppLink } from '../types';

interface PreviewModalProps {
  link: AppLink | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ link, onClose }) => {
  if (!link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300 truncate">
                Pratonton: {link.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-md">
                {link.url}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <span>Buka Di Tab Baharu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice for sites blocking iframe */}
        <div className="px-4 py-2 bg-amber-50/60 dark:bg-amber-500/5 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center justify-between text-xs text-amber-800 dark:text-amber-400">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Sesetengah portal KPM, Google Docs, atau sistem kerajaan menghadkan paparan iframe demi keselamatan. Jika paparan kosong, sila klik "Buka Di Tab Baharu".
          </span>
        </div>

        {/* Iframe Viewport */}
        <div className="flex-1 bg-white relative">
          <iframe
            src={link.url}
            title={link.title}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

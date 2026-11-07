import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Copy, 
  Check, 
  Pencil
} from 'lucide-react';
import { AppModule } from '../types';
import { IconRenderer } from './IconRenderer';

interface GlossyButtonProps {
  module: AppModule;
  onEdit: (module: AppModule) => void;
}

export const GlossyButton: React.FC<GlossyButtonProps> = ({ module, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(module.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(module);
  };

  // Preset warna berkilat bagi setiap modul 1 hingga 6
  const getButtonPreset = (order: number) => {
    switch (order) {
      case 1:
        return {
          themeClass: 'glossy-blue',
          numBg: 'bg-blue-950/70 text-blue-200 border-blue-400/40',
          iconColor: 'text-blue-100',
        };
      case 2:
        return {
          themeClass: 'glossy-emerald',
          numBg: 'bg-emerald-950/70 text-emerald-200 border-emerald-400/40',
          iconColor: 'text-emerald-100',
        };
      case 3:
        return {
          themeClass: 'glossy-amber',
          numBg: 'bg-amber-950/70 text-amber-200 border-amber-400/40',
          iconColor: 'text-amber-100',
        };
      case 4:
        return {
          themeClass: 'glossy-cyan',
          numBg: 'bg-cyan-950/70 text-cyan-200 border-cyan-400/40',
          iconColor: 'text-cyan-100',
        };
      case 5:
        return {
          themeClass: 'glossy-red',
          numBg: 'bg-rose-950/70 text-rose-200 border-rose-400/40',
          iconColor: 'text-rose-100',
        };
      case 6:
        return {
          themeClass: 'glossy-purple',
          numBg: 'bg-purple-950/70 text-purple-200 border-purple-400/40',
          iconColor: 'text-purple-100',
        };
      default:
        return {
          themeClass: 'glossy-blue',
          numBg: 'bg-slate-900/70 text-slate-200 border-slate-600',
          iconColor: 'text-white',
        };
    }
  };

  const preset = getButtonPreset(module.orderNumber);

  return (
    <div className="w-full select-none group">
      <a
        href={module.url}
        target="_blank"
        rel="noopener noreferrer"
        id={`btn-app-${module.id}`}
        className={`glossy-btn ${preset.themeClass} rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4 text-white cursor-pointer`}
      >
        {/* Lapisan Kilatan Kaca (Specular Highlight) */}
        <div className="glossy-glass-reflection" />

        {/* Cahaya Shimmer Menyapu */}
        <div className="glossy-shine-sweep" />

        {/* Bahagian Kiri: Nombor + Ikon + Tajuk Lengkap */}
        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Nombor & Ikon Padat (Khas untuk Skrin Telefon) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Lencana Nombor */}
            <span className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${preset.numBg} border flex items-center justify-center font-mono font-black text-xs sm:text-base text-white shadow-inner backdrop-blur-sm`}>
              {module.orderNumber}
            </span>

            {/* Ikon */}
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm shadow-sm">
              <IconRenderer name={module.icon} className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
            </div>
          </div>

          {/* Tajuk Utama Butang: TIDAK DIKERAT / TIDAK TRUNCATE supaya nampak penuh di handphone */}
          <div className="min-w-0 flex-1 py-0.5">
            <h3 className="text-xs sm:text-base md:text-lg font-extrabold text-white uppercase tracking-normal sm:tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight sm:leading-snug break-words">
              {module.title}
            </h3>
          </div>
        </div>

        {/* Bahagian Kanan: Butang Tindakan Padat */}
        <div className="relative z-10 flex items-center gap-1 sm:gap-2 flex-shrink-0">
          
          {/* Salin Pautan */}
          <button
            type="button"
            onClick={handleCopy}
            id={`btn-copy-${module.id}`}
            title="Salin pautan"
            className="p-1.5 sm:p-2 rounded-lg bg-black/25 hover:bg-black/45 border border-white/25 text-white/90 hover:text-amber-200 transition-all active:scale-90"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Edit URL */}
          <button
            type="button"
            onClick={handleEdit}
            id={`btn-edit-${module.id}`}
            title="Tukar URL"
            className="p-1.5 sm:p-2 rounded-lg bg-black/25 hover:bg-black/45 border border-white/25 text-white/90 hover:text-amber-200 transition-all active:scale-90"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Buka Anak Panah */}
          <div className="pl-1 sm:pl-2 flex items-center text-white/90 group-hover:text-white transition-transform group-hover:translate-x-0.5">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
        </div>
      </a>
    </div>
  );
};

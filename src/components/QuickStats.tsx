import React from 'react';
import { 
  Music, 
  Users, 
  Award, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  Headphones
} from 'lucide-react';

interface QuickStatsProps {
  totalModules: number;
  configuredCount: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ totalModules, configuredCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden group hover:border-amber-500/40 transition shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Modul Aplikasi</span>
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Music className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{totalModules}</span>
          <span className="text-[11px] text-amber-400/90 font-medium">Teras SSeMJ</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Data Murid, Kehadiran, Aset, Asrama, Aktiviti, e-RPH</p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden group hover:border-emerald-500/40 transition shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Status Capaian</span>
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">100%</span>
          <span className="text-[11px] text-emerald-300 font-medium">Sedia Digunakan</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Pautan pantas ke sistem Google & portal</p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden group hover:border-blue-500/40 transition shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Pengkhususan Seni</span>
          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Headphones className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">T1 - T5</span>
          <span className="text-[11px] text-blue-300 font-medium">Orkestra & Tradisional</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Strings, Brass, Woodwind, Gamelan, Koir</p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden group hover:border-violet-500/40 transition shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Sesi Persekolahan</span>
          <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">2026/27</span>
          <span className="text-[11px] text-violet-300 font-medium">KSSM Kesenian</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Kurikulum Standard Seni Muzik KPM</p>
      </div>

    </div>
  );
};

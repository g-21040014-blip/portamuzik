import React from 'react';
import { Bell, Calendar, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { DepartmentAnnouncement } from '../types';

interface AnnouncementsProps {
  announcements: DepartmentAnnouncement[];
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  return (
    <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 relative overflow-hidden shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
              Pemberitahuan & Takwim Semasa Jabatan Seni Muzik
            </h4>
            <p className="text-[11px] text-slate-400">Peringatan jadual latihan, semakan aset dan e-RPH mingguan</p>
          </div>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
          Johor Darul Ta'zim
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {announcements.map((item) => (
          <div 
            key={item.id}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  item.type === 'urgent'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : item.type === 'info'
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.tag}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {item.date}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 line-clamp-2">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface AnnouncementBarProps {
  onDismiss?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/70 dark:bg-blue-500/5 px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
          <span className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400 shrink-0">
            <Bell className="w-3.5 h-3.5" />
            Pemberitahuan:
          </span>
          <span className="text-slate-600 dark:text-slate-400 truncate">
            Sila pastikan rekod e-Kehadiran Kelas Kesenian & e-RPH minggu semasa disahkan sebelum Jumaat 12:00 tengah hari.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline tabular-nums">
            Sesi 2026/2027
          </span>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
            title="Tutup pemberitahuan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

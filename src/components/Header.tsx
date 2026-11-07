import React from 'react';
import {
  Menu,
  Plus,
  Volume2,
  VolumeX,
  LayoutDashboard,
  SlidersHorizontal,
  BookOpen,
  Tag,
  FileSpreadsheet,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  activeTab: 'dashboard' | 'manage' | 'panduan';
  setActiveTab: (tab: 'dashboard' | 'manage' | 'panduan') => void;
  onOpenAddModal: () => void;
  onOpenCategoryManager?: () => void;
  onOpenGoogleSheetsModal?: () => void;
  isAudioOn: boolean;
  setIsAudioOn: (on: boolean) => void;
  onToggleMobileSidebar: () => void;
  isCloudSynced?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenCategoryManager,
  onOpenGoogleSheetsModal,
  isAudioOn,
  setIsAudioOn,
  onToggleMobileSidebar,
  isCloudSynced = false,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'manage':
        return 'Pengurusan Pautan';
      case 'panduan':
        return 'Panduan Guru';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-colors flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onToggleMobileSidebar();
          }}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean SaaS Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 min-w-0">
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500">
            Seni Muzik SSeMJ
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">/</span>
          <span className="font-bold text-blue-900 dark:text-blue-300 truncate">
            {getTabTitle()}
          </span>
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {isCloudSynced && (
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium"
            title="Pangkalan data awan Firebase Firestore aktif & terselaras secara langsung"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Awan Langsung</span>
          </div>
        )}

        {/* Audio Chime Feedback Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextState = !isAudioOn;
            setIsAudioOn(nextState);
            soundFx.enabled = nextState;
            if (nextState) soundFx.playClick();
          }}
          title={isAudioOn ? 'Senyapkan Bunyi Harmoni' : 'Aktifkan Bunyi Harmoni'}
          className={`p-2 rounded-lg border transition-colors ${
            isAudioOn
              ? 'text-teal-700 bg-teal-50 border-teal-200/60 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Category Manager Modal Button */}
        {onOpenCategoryManager && (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOpenCategoryManager();
            }}
            title="Tambah, Edit, atau Padam Kategori"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Urus Kategori</span>
            <span className="sm:hidden">Kategori</span>
          </button>
        )}

        {/* Google Sheets Sync Button */}
        {onOpenGoogleSheetsModal && (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOpenGoogleSheetsModal();
            }}
            title="Penyelarasan Google Sheets & Apps Script (Data Berpusat)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300/80 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold text-[11px] sm:text-xs">Google Sheets</span>
          </button>
        )}

        {/* Primary Action Button: Tambah Pautan */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onOpenAddModal();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-all shadow-xs shadow-blue-500/10 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Pautan</span>
        </button>
      </div>
    </header>
  );
};

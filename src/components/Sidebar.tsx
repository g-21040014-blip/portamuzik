import React from 'react';
import {
  LayoutDashboard,
  SlidersHorizontal,
  BookOpen,
  Music,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Download,
  X,
  Layers,
  Award,
  FileSpreadsheet,
  Tag,
  Smartphone,
} from 'lucide-react';
import { CategoryType } from '../types';
import { soundFx } from '../utils/audio';
import { getCategoryIcon } from '../utils/categoryIcons';

interface SidebarProps {
  activeTab: 'dashboard' | 'manage' | 'panduan';
  setActiveTab: (tab: 'dashboard' | 'manage' | 'panduan') => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  categories: { label: string; value: string }[];
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenAddModal: () => void;
  onOpenCategoryManager?: () => void;
  onOpenGoogleSheetsModal?: () => void;
  onExportConfig: () => void;
  totalLinksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onOpenAddModal,
  onOpenCategoryManager,
  onOpenGoogleSheetsModal,
  onExportConfig,
  totalLinksCount,
}) => {
  const handleNavClick = (tab: 'dashboard' | 'manage' | 'panduan') => {
    soundFx.playClick();
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const handleCategoryShortcut = (cat: CategoryType) => {
    soundFx.playClick();
    setActiveTab('dashboard');
    setSelectedCategory(cat);
    setIsMobileOpen(false);
  };

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: totalLinksCount > 0 ? String(totalLinksCount) : undefined,
    },
    {
      id: 'manage' as const,
      label: 'Pengurusan Pautan',
      icon: SlidersHorizontal,
    },
    {
      id: 'panduan' as const,
      label: 'Panduan Guru',
      icon: BookOpen,
    },
  ];


  const displayCategories = categories.filter(
    (c) =>
      c.value !== 'Semua' &&
      !c.value.toLowerCase().includes('takwim') &&
      !c.value.toLowerCase().includes('takwin') &&
      !c.value.toLowerCase().includes('2027') &&
      !c.value.toLowerCase().includes('2007')
  );

  const sidebarContent = (
    <aside
      className={`h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
          <div
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-3 cursor-pointer overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <img
              src="/assets/aistudio/LOGO_SSEMJ_TAK_DE_NAMA_SEKOLAH_b4e0aa10.jfif"
              alt="Logo Sekolah Seni Malaysia Johor"
              className="w-9 h-9 object-contain shrink-0 drop-shadow-sm rounded-lg"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold tracking-tight text-blue-900 dark:text-blue-300 truncate">
                  Seni Muzik SSeMJ
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Sekolah Seni Malaysia Johor
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className={`hidden md:flex p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'hidden' : ''
            }`}
            title={isCollapsed ? 'Kembangkan Menu' : 'Kuncupkan Menu'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsed Expand Trigger */}
        {isCollapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsCollapsed(false);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Kembangkan Menu"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Navigation Group */}
        <div className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu Utama
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-200/60 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Categories Navigation */}
        {!isCollapsed && (
          <div className="p-3 pt-2 space-y-1 border-t border-slate-100 dark:border-slate-800/80">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Kategori Pantas</span>
              <div className="flex items-center gap-2">
                {onOpenCategoryManager && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onOpenCategoryManager();
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    title="Urus, Tambah, Edit, atau Padam Kategori"
                  >
                    Urus
                  </button>
                )}
                <span className="text-[10px] text-slate-400 dark:text-slate-500 cursor-pointer hover:underline" onClick={() => handleCategoryShortcut('Semua')}>
                  Semua
                </span>
              </div>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {displayCategories.map((qc) => {
                const Icon = getCategoryIcon(qc.value);
                const isSelected = activeTab === 'dashboard' && selectedCategory === qc.value;
                return (
                  <button
                    key={qc.value}
                    type="button"
                    onClick={() => handleCategoryShortcut(qc.value as CategoryType)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300 font-semibold'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{qc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile & System Info */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Unit Seni Muzik
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Penyelaras Portal
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
              Aktif
            </span>
          </div>
        )}

        {/* Quick Google Sheets Sync button */}
        {onOpenGoogleSheetsModal && (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOpenGoogleSheetsModal();
            }}
            title="Penyelarasan Google Sheets & Excel (Data Berpusat)"
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {!isCollapsed && <span className="truncate">Google Sheets & Excel</span>}
          </button>
        )}

        {/* Quick Export backup button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onExportConfig();
          }}
          title="Muat Turun Sandaran Data"
          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <Download className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          {!isCollapsed && <span className="truncate">Sandaran Konfigurasi</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

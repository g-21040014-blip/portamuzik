import React, { useState } from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Star,
  Copy,
  Check,
  Filter,
  Tag,
  Info,
  FileSpreadsheet,
} from 'lucide-react';
import { AppLink } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { soundFx } from '../utils/audio';

interface ManageLinksTabProps {
  links: AppLink[];
  onAddClick: () => void;
  onOpenCategoryManager?: () => void;
  onOpenGoogleSheetsModal?: () => void;
  onEditClick: (link: AppLink) => void;
  onDeleteClick: (id: string) => void;
  onToggleActive: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onResetToDefaults: () => void;
  onExportConfig: () => void;
  onImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ManageLinksTab: React.FC<ManageLinksTabProps> = ({
  links,
  onAddClick,
  onOpenCategoryManager,
  onOpenGoogleSheetsModal,
  onEditClick,
  onDeleteClick,
  onToggleActive,
  onToggleFavorite,
  onMoveUp,
  onMoveDown,
  onResetToDefaults,
  onExportConfig,
  onImportConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    links.forEach((l) => set.add(l.category));
    return ['Semua', ...Array.from(set)];
  }, [links]);

  const filteredLinks = links.filter((l) => {
    if (filterCategory !== 'Semua' && l.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.subCategory && l.subCategory.toLowerCase().includes(q)) ||
        l.description.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (id: string, url: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyJson = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(JSON.stringify(links, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300">
            Pengurusan & Konfigurasi Pautan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Urus pautan rasmi, kemaskini URL Google Form / Google Drive sebenar panitia muzik, susun urutan paparan atau buat sandaran fail.
          </p>
        </div>

        {/* Global Actions Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add New Link CTA */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onAddClick();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pautan</span>
          </button>

          {/* Manage Categories CTA */}
          {onOpenCategoryManager && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onOpenCategoryManager();
              }}
              title="Tambah, Edit, atau Padam Kategori"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-2xs"
            >
              <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Urus Kategori</span>
            </button>
          )}

          {/* Google Sheets & Excel Sync CTA */}
          {onOpenGoogleSheetsModal && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onOpenGoogleSheetsModal();
              }}
              title="Tarik data daripada Google Sheets (Google Drive) atau Muat Turun fail Excel/CSV"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/60 rounded-lg transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Google Sheets & Excel</span>
            </button>
          )}

          {/* Export JSON */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onExportConfig();
            }}
            title="Eksport sandaran pautan dalam format fail JSON"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Eksport Data</span>
          </button>

          {/* Copy JSON to Clipboard */}
          <button
            type="button"
            onClick={handleCopyJson}
            title="Salin data pautan (JSON) ke papan klip untuk dikongsi atau dimasukkan ke dalam kod"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            {copiedJson ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedJson ? 'JSON Disalin!' : 'Salin JSON'}</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportConfig}
              className="hidden"
            />
          </label>

          {/* Reset to Defaults */}
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            title="Kembalikan kepada senarai pautan lalai Seni Muzik SSeMJ"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Set Semula</span>
          </button>
        </div>
      </div>

      {/* Sync tip between preview and Vercel */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/80 dark:border-blue-800/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-950 dark:text-blue-100">
            Panduan Segerak Data ke Vercel / GitHub:
          </p>
          <p className="text-[11px] text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
            Pautan yang anda tambah atau edit dalam antaramuka ini disimpan dalam storan pelayar tempatan (<em>local storage</em>). Jika laman Vercel anda masih memaparkan senarai lama:
            <br />
            <strong>Pilihan 1 (Paling Pantas):</strong> Klik butang <strong>Eksport Data</strong> di atas, kemudian buka laman Vercel anda dan klik <strong>Import Data</strong> untuk muat naik fail JSON tersebut.
            <br />
            <strong>Pilihan 2 (Kekal dalam Kod GitHub):</strong> Klik butang <strong>Salin JSON</strong> di atas dan tampalkan (*paste*) kod tersebut dalam perbualan ini supaya saya dapat simpannya terus ke dalam fail kod lalai (<em>defaultLinks.ts</em>).
          </p>
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dalam senarai pengurusan..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-600 shadow-xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'Semua' ? 'Semua Kategori' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums self-end sm:self-auto">
          Menunjukkan <strong className="font-semibold text-slate-800 dark:text-slate-200">{filteredLinks.length}</strong> daripada{' '}
          <strong className="font-semibold text-slate-800 dark:text-slate-200">{links.length}</strong> pautan
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-3 py-3 text-center w-14">
                  Susun
                </th>
                <th scope="col" className="px-4 py-3">
                  Aplikasi / Pautan
                </th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">
                  Kategori
                </th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                  Alamat URL
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Tiada pautan sepadan dengan kriteria carian.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const originalIndex = links.findIndex((l) => l.id === link.id);
                  return (
                    <tr
                      key={link.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition-colors group"
                    >
                      {/* Reorder Arrows */}
                      <td className="px-2 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            type="button"
                            disabled={originalIndex === 0}
                            onClick={() => onMoveUp(originalIndex)}
                            title="Naikkan kedudukan"
                            className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={originalIndex === links.length - 1}
                            onClick={() => onMoveDown(originalIndex)}
                            title="Turunkan kedudukan"
                            className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Title & Icon */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700">
                            <DynamicIcon name={link.iconName} className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                              <span className="truncate">{link.title}</span>
                              {link.isFavorite && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs md:max-w-md">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Sub Category */}
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 hidden md:table-cell whitespace-nowrap">
                        <span className="font-medium">{link.category}</span>
                        {link.subCategory && (
                          <span className="block text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            ↳ {link.subCategory}
                          </span>
                        )}
                        {link.badgeText && (
                          <span className="block text-[11px] text-teal-600 dark:text-teal-400">
                            {link.badgeText}
                          </span>
                        )}
                      </td>

                      {/* URL Monospace */}
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 dark:text-slate-400 hidden lg:table-cell max-w-[220px] truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{link.url}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.id, link.url)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 p-0.5"
                            title="Salin pautan"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status Active Toggle Switch */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            onToggleActive(link.id);
                          }}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            link.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {link.isActive ? 'Aktif' : 'Nyahaktif'}
                        </button>
                      </td>

                      {/* Row Action Controls */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Test Link */}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Buka Pautan di Tab Baharu"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              onEditClick(link);
                            }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Kemaskini Pautan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(link.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            title="Padam Pautan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Set Semula ke Pautan Asal?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
              Tindakan ini akan mengembalikan kesemua 8 pautan rasmi lalai Sekolah Seni Malaysia Johor. Sebarang perubahan URL atau pautan tersuai akan dipadam melainkan anda telah mengeksport fail sandaran JSON terlebih dahulu.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playSuccess();
                  onResetToDefaults();
                  setResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Ya, Set Semula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Padam Pautan Ini?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
              Adakah anda pasti mahu memadamkan pautan ini daripada senarai pengurusan dan papan pemuka portal?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onDeleteClick(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

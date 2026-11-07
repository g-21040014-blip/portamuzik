import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  FolderPlus,
  Tag,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AppLink, CategoryType } from '../types';
import { getCategoryIcon } from '../utils/categoryIcons';
import { soundFx } from '../utils/audio';
import { validateCategoryName, isForbiddenCategory } from '../utils/categoryValidation';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { label: string; value: string }[];
  links: AppLink[];
  onAddCategory: (categoryName: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string, fallbackCategory: string) => void;
  onMoveCategory?: (index: number, direction: 'up' | 'down') => void;
  onResetCategoriesToDefaults: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  links,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onMoveCategory,
  onResetCategoriesToDefaults,
}) => {
  const [newCatInput, setNewCatInput] = useState('');
  const [newCatError, setNewCatError] = useState<string | null>(null);

  // Editing state: { oldName: string, newName: string } | null
  const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirmation state: categoryName | null
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null);
  const [fallbackCat, setFallbackCat] = useState<string>('Kesenian & Muzik');

  // Filter out "Semua" from displayable categories
  const activeCategories = useMemo(() => {
    return categories
      .filter((c) => c.value !== 'Semua' && !isForbiddenCategory(c.value))
      .map((c) => c.value);
  }, [categories]);

  // Count links per category
  const linkCountMap = useMemo(() => {
    const map = new Map<string, number>();
    links.forEach((l) => {
      const cat = l.category;
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return map;
  }, [links]);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    const validation = validateCategoryName(trimmed);
    if (!validation.isValid) {
      setNewCatError(validation.errorMessage || 'Nama kategori tidak sah.');
      return;
    }

    if (activeCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setNewCatError(`Kategori "${trimmed}" sudah pun wujud dalam senarai.`);
      return;
    }

    soundFx.playSuccess();
    onAddCategory(trimmed);
    setNewCatInput('');
    setNewCatError(null);
  };

  const handleStartEdit = (cat: string) => {
    soundFx.playClick();
    setEditingCategory({ oldName: cat, newName: cat });
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const trimmed = editingCategory.newName.trim();
    const validation = validateCategoryName(trimmed);
    if (!validation.isValid) {
      setEditError(validation.errorMessage || 'Nama kategori tidak sah.');
      return;
    }

    if (
      trimmed.toLowerCase() !== editingCategory.oldName.toLowerCase() &&
      activeCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      setEditError(`Kategori "${trimmed}" sudah pun wujud.`);
      return;
    }

    soundFx.playSuccess();
    onRenameCategory(editingCategory.oldName, trimmed);
    setEditingCategory(null);
    setEditError(null);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteCat) return;
    soundFx.playSuccess();
    onDeleteCategory(confirmDeleteCat, fallbackCat);
    setConfirmDeleteCat(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Pengurusan Kategori Aplikasi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tambah kategori baharu, kemas kini nama (edit), atau padam kategori sedia ada.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Tambah Kategori Baharu */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Tambah Kategori Baharu</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Jumlah: {activeCategories.length} Kategori
              </span>
            </div>

            <form onSubmit={handleAddSubmit} className="flex gap-2">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => {
                  setNewCatInput(e.target.value);
                  if (newCatError) setNewCatError(null);
                }}
                placeholder="Contoh: Appsheet, Pentaksiran, Orkestra..."
                className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </form>

            {newCatError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-2 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{newCatError}</span>
              </div>
            )}
          </div>

          {/* 2. Senarai Kategori Sedia Ada */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Senarai Kategori Sedia Ada
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Adakah anda ingin set semula kategori kepada senarai lalai asal?')) {
                    soundFx.playClick();
                    onResetCategoriesToDefaults();
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                title="Pulihkan kategori rasmi lalai"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Set Semula Lalai</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {activeCategories.map((cat, catIdx) => {
                const Icon = getCategoryIcon(cat);
                const count = linkCountMap.get(cat) || 0;
                const isEditingThis = editingCategory?.oldName === cat;

                if (isEditingThis) {
                  return (
                    <form
                      key={cat}
                      onSubmit={handleSaveEdit}
                      className="p-2.5 rounded-lg border-2 border-blue-500 bg-blue-50/40 dark:bg-blue-900/20 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                        <input
                          type="text"
                          value={editingCategory.newName}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              newName: e.target.value,
                            })
                          }
                          autoFocus
                          className="flex-1 px-2.5 py-1 text-xs sm:text-sm font-semibold rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(null);
                            setEditError(null);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                        >
                          Batal
                        </button>
                      </div>
                      {editError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 pl-6">
                          {editError}
                        </p>
                      )}
                    </form>
                  );
                }

                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {cat}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          count > 0
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {count} Pautan
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Arrow Up Button */}
                      {onMoveCategory && (
                        <button
                          type="button"
                          onClick={() => onMoveCategory(catIdx, 'up')}
                          disabled={catIdx === 0}
                          title="Alih Kategori Naik (▲)"
                          className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded-md transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Arrow Down Button */}
                      {onMoveCategory && (
                        <button
                          type="button"
                          onClick={() => onMoveCategory(catIdx, 'down')}
                          disabled={catIdx === activeCategories.length - 1}
                          title="Alih Kategori Turun (▼)"
                          className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded-md transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        title={`Edit / Tukar nama kategori "${cat}"`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setConfirmDeleteCat(cat);
                          // Default fallback to first other category
                          const firstOther = activeCategories.find((c) => c !== cat) || 'Kesenian & Muzik';
                          setFallbackCat(firstOther);
                        }}
                        title={`Padam kategori "${cat}"`}
                        disabled={activeCategories.length <= 1}
                        className={`p-1.5 rounded-md transition-colors ${
                          activeCategories.length <= 1
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                            : 'text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Sub-modal */}
        {confirmDeleteCat && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Padam Kategori: "{confirmDeleteCat}"?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {linkCountMap.get(confirmDeleteCat) && linkCountMap.get(confirmDeleteCat)! > 0 ? (
                      <>
                        Kategori ini sedang digunakan oleh{' '}
                        <strong className="text-rose-600 dark:text-rose-400">
                          {linkCountMap.get(confirmDeleteCat)} pautan
                        </strong>
                        . Pautan tersebut akan dipindahkan ke kategori pilihan di bawah:
                      </>
                    ) : (
                      'Tiada pautan yang menggunakan kategori ini. Kategori ini boleh dipadam dengan selamat.'
                    )}
                  </p>
                </div>
              </div>

              {linkCountMap.get(confirmDeleteCat) && linkCountMap.get(confirmDeleteCat)! > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pindahkan pautan ke:
                  </label>
                  <select
                    value={fallbackCat}
                    onChange={(e) => setFallbackCat(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {activeCategories
                      .filter((c) => c !== confirmDeleteCat)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteCat(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                >
                  Ya, Padam Kategori
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Sebarang perubahan kategori akan diselaraskan serta-merta pada pautan & menu.
          </span>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

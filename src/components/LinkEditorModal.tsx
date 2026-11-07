import React, { useState, useEffect } from 'react';
import { X, Check, Globe, FolderPlus } from 'lucide-react';
import { AppLink, CategoryType } from '../types';
import { AVAILABLE_ICONS, COLOR_OPTIONS, CATEGORIES } from '../data/defaultLinks';
import { DynamicIcon } from './DynamicIcon';
import { soundFx } from '../utils/audio';
import { validateCategoryName, isForbiddenCategory } from '../utils/categoryValidation';

interface LinkEditorModalProps {
  isOpen: boolean;
  linkToEdit: AppLink | null;
  availableCategories?: string[];
  onClose: () => void;
  onSave: (link: AppLink) => void;
  onAddNewCategory?: (newCategory: string) => void;
}

export const LinkEditorModal: React.FC<LinkEditorModalProps> = ({
  isOpen,
  linkToEdit,
  availableCategories = [],
  onClose,
  onSave,
  onAddNewCategory,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Kesenian & Muzik');
  const [subCategory, setSubCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Music');
  const [color, setColor] = useState<AppLink['color']>('amber');
  const [badgeText, setBadgeText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [target, setTarget] = useState<'_blank' | '_self'>('_blank');
  const [error, setError] = useState<string | null>(null);

  // Compute combined category options
  const categoryOptions = React.useMemo(() => {
    const isBanned = (cat: string) => {
      const lower = (cat || '').toLowerCase().trim();
      return lower.includes('takwim') || lower.includes('takwin') || lower.includes('2027') || lower.includes('2007');
    };
    if (availableCategories && availableCategories.length > 0) {
      return availableCategories.filter((c) => c !== 'Semua' && !isBanned(c));
    }
    return CATEGORIES.filter((c) => c.value !== 'Semua' && !isBanned(c.value)).map((c) => c.value);
  }, [availableCategories]);

  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setCategory(linkToEdit.category);
      setSubCategory(linkToEdit.subCategory || '');
      setIsAddingNewCategory(false);
      setNewCategoryInput('');
      setUrl(linkToEdit.url);
      setDescription(linkToEdit.description);
      setIconName(linkToEdit.iconName);
      setColor(linkToEdit.color);
      setBadgeText(linkToEdit.badgeText || '');
      setIsFavorite(Boolean(linkToEdit.isFavorite));
      setIsActive(linkToEdit.isActive !== false);
      setTarget(linkToEdit.target || '_blank');
      setError(null);
    } else {
      setTitle('');
      setCategory('Kesenian & Muzik');
      setSubCategory('');
      setIsAddingNewCategory(false);
      setNewCategoryInput('');
      setUrl('https://');
      setDescription('');
      setIconName('Music');
      setColor('blue');
      setBadgeText('');
      setIsFavorite(false);
      setIsActive(true);
      setTarget('_blank');
      setError(null);
    }
  }, [linkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Sila masukkan nama aplikasi atau pautan.');
      return;
    }
    if (!url.trim() || url === 'https://' || url === 'http://') {
      setError('Sila masukkan alamat URL pautan yang sah.');
      return;
    }

    let finalCategory = category;
    if (isAddingNewCategory) {
      const trimmedNewCat = newCategoryInput.trim();
      if (!trimmedNewCat) {
        setError('Sila masukkan nama kategori baharu yang ingin ditambah.');
        return;
      }
      finalCategory = trimmedNewCat;
      if (onAddNewCategory) {
        onAddNewCategory(trimmedNewCat);
      }
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const today = new Date().toISOString().split('T')[0];
    const newOrUpdatedLink: AppLink = {
      id: linkToEdit ? linkToEdit.id : `link-${Date.now()}`,
      title: title.trim(),
      category: finalCategory === 'Semua' ? 'Kesenian & Muzik' : finalCategory,
      subCategory: subCategory.trim() || undefined,
      description: description.trim() || 'Aplikasi pengurusan Seni Muzik Sekolah Seni Malaysia Johor.',
      url: finalUrl,
      iconName: iconName || 'Music',
      color: color || 'blue',
      badgeText: badgeText.trim() || undefined,
      isFavorite,
      isActive,
      target,
      lastUpdated: today,
    };

    soundFx.playSuccess();
    onSave(newOrUpdatedLink);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <h2 className="text-base font-bold text-blue-900 dark:text-blue-300">
              {linkToEdit ? 'Kemaskini Pautan Aplikasi' : 'Tambah Pautan Baharu'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Portal Pengurusan Seni Muzik SSeMJ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Aplikasi / Pautan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Maklumat Murid / Rekod Kehadiran Muzik"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Category with Add New Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Kategori <span className="text-rose-500">*</span>
                </label>
                {!isAddingNewCategory ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(true);
                      setNewCategoryInput('');
                    }}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    + Kategori Baharu
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setNewCategoryInput('');
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Batal
                  </button>
                )}
              </div>

              {!isAddingNewCategory ? (
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__NEW_CATEGORY__') {
                      setIsAddingNewCategory(true);
                      setNewCategoryInput('');
                    } else {
                      setCategory(val as CategoryType);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <optgroup label="Senarai Sedia Ada">
                    {categoryOptions.map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Pilihan Tambahan">
                    <option value="__NEW_CATEGORY__" className="text-blue-600 dark:text-blue-400 font-semibold">
                      ➕ Tambah Kategori Baharu...
                    </option>
                  </optgroup>
                </select>
              ) : (
                <div className="space-y-1">
                  <input
                    type="text"
                    autoFocus
                    required
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Nama kategori baharu..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-[10px] text-blue-600 dark:text-blue-400">
                    Kategori baharu akan automatik disimpan ke senarai penapis portal.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Sub Kategori (Pilihan)
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Contoh: Muzik Tradisional / Tingkatan 5 / Sukan"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* URL & Label Ringkas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Pautan (URL / Link) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/... atau https://apdm.moe.gov.my"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Label Ringkas (Pilihan)
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Contoh: Rasmi / Guru"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Keterangan Ringkas
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penerangan peranan aplikasi atau sistem ini..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none leading-relaxed"
            />
          </div>

          {/* Color & Icon Pickers */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Warna Tema Ikon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={`h-8 rounded-lg flex items-center justify-center border transition-all ${
                      c.bgClass
                    } ${
                      color === c.name
                        ? 'ring-2 ring-blue-600 border-transparent shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  >
                    {color === c.name && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Pilih Ikon
              </label>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIconName(ic)}
                    className={`p-1.5 rounded-md flex items-center justify-center border transition-colors ${
                      iconName === ic
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-slate-200 dark:border-slate-700'
                    }`}
                    title={ic}
                  >
                    <DynamicIcon name={ic} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target & Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Sasaran Pembukaan
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as '_blank' | '_self')}
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="_blank">Tab Baharu (_blank)</option>
                <option value="_self">Tab Semasa (_self)</option>
              </select>
            </div>

            <div className="flex items-center gap-5 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-500/20">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded border-amber-400 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <span>Jadikan Link Favourite (⭐)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Aktif</span>
              </label>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            {linkToEdit ? 'Simpan Perubahan' : 'Tambah Pautan'}
          </button>
        </div>
      </div>
    </div>
  );
};

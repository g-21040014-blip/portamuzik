import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Link2, 
  Info,
  HelpCircle
} from 'lucide-react';
import { AppModule, SubLink } from '../types';

interface EditLinkModalProps {
  module: AppModule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedModule: AppModule) => void;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  module,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AppModule | null>(null);
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubUrl, setNewSubUrl] = useState('');

  useEffect(() => {
    if (module) {
      setFormData({ ...module });
    }
  }, [module]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave({
        ...formData,
        updatedAt: new Date().toISOString()
      });
      onClose();
    }
  };

  const handleAddSubLink = () => {
    if (!newSubTitle.trim() || !newSubUrl.trim()) return;
    const newSub: SubLink = {
      id: `sub-${Date.now()}`,
      title: newSubTitle.trim(),
      url: newSubUrl.trim()
    };
    setFormData({
      ...formData,
      subLinks: [...(formData.subLinks || []), newSub]
    });
    setNewSubTitle('');
    setNewSubUrl('');
  };

  const handleRemoveSubLink = (id: string) => {
    setFormData({
      ...formData,
      subLinks: formData.subLinks.filter(sub => sub.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kemas Kini Pautan Aplikasi</h3>
              <p className="text-xs text-slate-400">Modul #{formData.orderNumber}: {formData.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Main URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Pautan Utama (URL Aplikasi) *</span>
              {formData.url && formData.url.startsWith('http') && (
                <a 
                  href={formData.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Uji Pautan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://docs.google.com/spreadsheets/... atau Google Form / Web SSeMJ"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500" />
              Masukkan pautan Google Sheet, Google Form, Google Drive atau portal rasmi sekolah.
            </p>
          </div>

          {/* Title and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Nama Modul / Aplikasi *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Label Lencana (Badge)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Cth: Tingkatan 1 - 5, Harian"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Deskripsi Ringkas
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Notes / Tips */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Nota / Peringatan Pengurusan
            </label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Cth: Kemas kini setiap hari Jumaat sebelum 11.59 malam"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Sub-links manager */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200">
                Pautan Pantas Tambahan (Sub-links)
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.subLinks?.length || 0} pautan
              </span>
            </div>

            {/* List of sublinks */}
            <div className="space-y-1.5 mb-3 max-h-36 overflow-y-auto pr-1">
              {formData.subLinks && formData.subLinks.length > 0 ? (
                formData.subLinks.map((sub) => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs"
                  >
                    <div className="truncate mr-2">
                      <span className="font-medium text-slate-200">{sub.title}: </span>
                      <span className="text-slate-400 text-[11px]">{sub.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubLink(sub.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-1">Tiada pautan sampingan ditambah.</p>
              )}
            </div>

            {/* Add new sublink inputs */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nama pautan (cth: Borang Harian)"
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
                <input
                  type="url"
                  placeholder="URL pautan"
                  value={newSubUrl}
                  onChange={(e) => setNewSubUrl(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSubLink}
                className="w-full py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Pautan Sampingan</span>
              </button>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

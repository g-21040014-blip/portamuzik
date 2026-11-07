import React, { useState } from 'react';
import { X, PlusCircle, ExternalLink, Music, Info } from 'lucide-react';
import { AppModule, CategoryType } from '../types';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newModule: AppModule) => void;
  nextOrder: number;
}

export const AddAppModal: React.FC<AddAppModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  nextOrder
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CategoryType>('lain-lain');
  const [badge, setBadge] = useState('Modul Tambahan');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [icon, setIcon] = useState('Music2');
  const [accentColor, setAccentColor] = useState('amber');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const categoryLabels: Record<CategoryType, string> = {
      semua: 'Umum',
      murid: 'Pengurusan Murid',
      pdp: 'PdP Kesenian',
      aset: 'Fasiliti & Peralatan',
      asrama: 'Hal Ehwal Asrama',
      aktiviti: 'Aktiviti & Persembahan',
      erph: 'Akademik & Kurikulum',
      'lain-lain': 'Modul Khusus'
    };

    const newModule: AppModule = {
      id: `custom-${Date.now()}`,
      orderNumber: nextOrder,
      title: title.trim(),
      shortCode: `SSeMJ-${nextOrder}`,
      category,
      categoryLabel: categoryLabels[category] || 'Modul Khusus',
      description: description.trim() || 'Pautan sistem pengurusan kesenian Seni Muzik SSeMJ.',
      url: url.trim(),
      icon,
      accentColor,
      gradient: `from-${accentColor}-600/20 via-${accentColor}-500/10 to-transparent`,
      badge: badge.trim() || 'Aplikasi Muzik',
      notes: notes.trim(),
      subLinks: [],
      updatedAt: new Date().toISOString()
    };

    onAdd(newModule);
    onClose();
    // Reset form
    setTitle('');
    setUrl('');
    setDescription('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah Pautan Aplikasi Baharu</h3>
              <p className="text-xs text-slate-400">Daftar pautan Google Sheet, Google Form, atau portal berkaitan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Nama Aplikasi / Modul *
            </label>
            <input
              type="text"
              required
              placeholder="Cth: Tempahan Studio Rakaman Audio, Takwim Peperiksaan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Pautan URL Aplikasi *
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="lain-lain">Umum / Khusus</option>
                <option value="murid">Pengurusan Murid</option>
                <option value="pdp">PdP Kesenian</option>
                <option value="aset">Fasiliti & Aset</option>
                <option value="asrama">Hal Ehwal Asrama</option>
                <option value="aktiviti">Aktiviti & Persembahan</option>
                <option value="erph">Akademik & e-RPH</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Label Lencana (Badge)
              </label>
              <input
                type="text"
                placeholder="Cth: Tempahan, Pentadbiran"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Pilihan Ikon & Warna
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="Music2">Ikon Muzik 1</option>
                <option value="Music">Ikon Muzik 2</option>
                <option value="Radio">Studio / Audio</option>
                <option value="Calendar">Takwim / Jadual</option>
                <option value="Users">Murid / Warga</option>
                <option value="ClipboardCheck">Kehadiran / Semakan</option>
                <option value="BookOpen">Buku / e-RPH</option>
                <option value="Building2">Bangunan / Asrama</option>
                <option value="Sparkles">Acara / Konsert</option>
              </select>

              <select
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="amber">Warna Emas / Kuning (Amber)</option>
                <option value="indigo">Warna Indigo / Biru Gelap</option>
                <option value="emerald">Warna Hijau (Emerald)</option>
                <option value="sky">Warna Biru Langit (Sky)</option>
                <option value="rose">Warna Merah / Rose</option>
                <option value="violet">Warna Violet / Ungu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Keterangan Modul
            </label>
            <textarea
              rows={2}
              placeholder="Penerangan ringkas mengenai kegunaan aplikasi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Modul</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

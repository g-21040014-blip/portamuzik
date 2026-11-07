import React from 'react';
import { X, HelpCircle, FileSpreadsheet, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Panduan Penggunaan Dashboard SSeMJ</h3>
              <p className="text-xs text-slate-400">Cara meletakkan dan mengemas kini pautan aplikasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-300">
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Mengubah Pautan Sedia Ada (Google Sheets / Form / Drive)
            </h4>
            <p className="text-slate-400 pl-5 text-xs leading-relaxed">
              Klik ikon <strong>Pena / Pensel (Edit)</strong> pada mana-mana kad modul (cth: Data Murid, e-RPH, Pengurusan Aset). Masukkan pautan Google Sheet, Google Form, atau Google Drive panitia anda, kemudian tekan <strong>Simpan Perubahan</strong>. Pautan disimpan secara selamat dalam pelayar anda.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2. Menggunakan Pautan Pantas Sampingan (Sub-links)
            </h4>
            <p className="text-slate-400 pl-5 text-xs leading-relaxed">
              Setiap modul menyokong sub-pautan (contohnya: Borang Kehadiran Harian, Laporan Mingguan, Rekod Instrumen). Anda boleh menambah seberapa banyak pautan terperinci mengikut keperluan guru.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Menyemat (Pin) Aplikasi Kegemaran
            </h4>
            <p className="text-slate-400 pl-5 text-xs leading-relaxed">
              Klik ikon <strong>Pin</strong> pada bahagian atas kanan mana-mana kad untuk menyemat aplikasi penting ke kedudukan paling atas bagi akses pantas setiap hari.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              4. Menambah Modul Aplikasi Baharu
            </h4>
            <p className="text-slate-400 pl-5 text-xs leading-relaxed">
              Jika terdapat keperluan sistem tambahan seperti tempahan studio rakaman atau takwim peperiksaan luar ABRSM, tekan butang <strong>+ Tambah Pautan</strong> di bahagian atas.
            </p>
          </div>

          <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-xs text-blue-300">
            <strong>Cadangan Perkongsian:</strong> Bookmark laman portal ini pada Google Chrome atau pelayar telefon guru-guru muzik untuk capaian harian yang pantas dan kemas.
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition"
          >
            Faham & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

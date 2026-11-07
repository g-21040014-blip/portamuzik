import React from 'react';
import { BookOpen, Edit, FileCode, CheckCircle2, ShieldCheck, Download, Upload, ExternalLink, FileSpreadsheet } from 'lucide-react';

export const PanduanTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-700 dark:text-slate-300">
      {/* Overview Card */}
      <div className="p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300 mb-1">
              Panduan Pentadbir & Pengurusan Portal Seni Muzik
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Pusat akses bersepadu guru dan pentadbir Unit Seni Muzik Sekolah Seni Malaysia Johor bagi mencapai pangkalan data murid, log kehadiran amali, pengurusan aset studio, bilik asrama, aktiviti kokurikulum, e-RPH, PLC dan modul kesenian Sk@S.
            </p>
          </div>
        </div>
      </div>

      {/* Centralized Google Sheets Card */}
      <div className="p-5 sm:p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-200">
              Penyelarasan Pautan Berpusat Melalui Google Sheets (Google Drive)
            </h3>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              Pastikan semua orang yang membuka aplikasi di Vercel atau telefon sentiasa melihat data yang tetap dan seragam.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          Anda boleh klik butang <strong>"Google Sheets & Excel"</strong> untuk memuat turun fail template Excel (CSV), muat naik ke Google Drive anda, dan simpan pautan Google Sheet tersebut. Setiap kali aplikasi dibuka, ia boleh menarik data terkini secara langsung daripada Google Sheet anda tanpa perlu deploy semula ke GitHub mahupun Vercel!
        </p>
      </div>

      {/* 4 Quick Setup Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-xs font-mono font-bold">1</span>
            <span>Memasukkan Pautan URL Sebenar</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Untuk menukar pautan contoh kepada URL Google Sheets, Google Forms atau Google Drive sebenar panitia anda, pergi ke tab <strong>"Pengurusan Pautan"</strong> dan klik ikon pensel (<Edit className="w-3 h-3 inline text-blue-600 dark:text-blue-400" />) pada baris pautan berkenaan.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs sm:text-sm">
            <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span>Menambah Aplikasi & Kategori Baharu</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Perlukan pautan tambahan seperti <em>Arkib Skor Muzik Digital</em>, <em>Bilik Rakaman Audio</em> atau <em>Borang Tempahan Bas</em>? Klik butang <strong>"+ Tambah Pautan"</strong>. Anda juga boleh mencipta nama kategori baharu terus di dalam borang.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs sm:text-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Eksport & Kongsi dengan Rakan Guru</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Klik <strong>"Eksport Data"</strong> untuk memuat turun fail sandaran <code>.json</code>. Fail ini boleh dikongsi melalui Telegram atau WhatsApp kepada guru-guru lain untuk dimuat naik menerusi butang <strong>"Import Data"</strong> dalam beberapa saat.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs sm:text-sm">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Penyimpanan Setempat Automatik</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Setiap pautan baharu, perubahan URL, dan susunan senarai disimpan secara serta-merta di dalam pelayar peranti anda (Local Storage), jadi data anda sentiasa kekal apabila membuka semula laman ini.
          </p>
        </div>
      </div>

      {/* 8 Core Official Modules Reference */}
      <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h3 className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300 mb-3">
          Senarai 8 Modul Penting Pengurusan Seni Muzik SSeMJ:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            <span><strong>Maklumat Murid:</strong> Profil murid & instrumen utama muzik.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span><strong>Rekod Kehadiran Kelas Kesenian:</strong> Kehadiran teori & amali studio.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span><strong>Pengurusan Aset:</strong> Inventori instrumen, bilik latihan & PA sistem.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
            <span><strong>Pengurusan Asrama:</strong> Log murid asrama muzik & bilik latihan malam.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span><strong>Aktiviti & Program (Kokurikulum):</strong> Konsert, bengkel & festival.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
            <span><strong>e-RPH:</strong> Rancangan Pengajaran Harian digital guru muzik.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
            <span><strong>PLC:</strong> Komuniti Pembelajaran Profesional guru muzik.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
            <span><strong>Sk@S:</strong> Portal Sistem Kesenian Sekolah Seni KPM.</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span><strong>OPR:</strong> Pelaporan Satu Muka Surat (One Page Report) aktiviti & konsert.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

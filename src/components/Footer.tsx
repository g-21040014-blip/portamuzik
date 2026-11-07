import React from 'react';
import { Music, MapPin, ShieldCheck, Mail, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Col 1: School Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Sekolah Seni Malaysia Johor</h4>
                <p className="text-[11px] text-amber-400/90 font-medium">Jabatan Kesenian Seni Muzik</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Melahirkan penggiat dan cendekiawan seni muzik berilmu, berdaya saing, berkeperibadian tinggi serta berakar umbi pada khazanah kesenian negara.
            </p>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Lokasi & Maklumat</h5>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Bandar Seri Alam, 81750 Masai, Johor Darul Ta'zim, Malaysia</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Kementerian Pendidikan Malaysia (KPM)</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Bidang: Muzik Klasik Barat, Muzik Tradisional & Etnik</span>
              </p>
            </div>
          </div>

          {/* Col 3: Portal Information */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Capaian Pantas 6 Modul Utama</h5>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400">
              <li className="hover:text-amber-300 transition">1. Data Murid</li>
              <li className="hover:text-amber-300 transition">2. Rekod Kehadiran</li>
              <li className="hover:text-amber-300 transition">3. Pengurusan Aset</li>
              <li className="hover:text-amber-300 transition">4. Pengurusan Asrama</li>
              <li className="hover:text-amber-300 transition">5. Aktiviti & Program</li>
              <li className="hover:text-amber-300 transition">6. e-RPH Muzik</li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Sekolah Seni Malaysia Johor (SSeMJ). Hak Cipta Terpelihara.</p>
          <p className="flex items-center gap-1">
            <span>Direka khas untuk warga pendidik & pengurusan Seni Muzik SSeMJ</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

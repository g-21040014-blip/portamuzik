import { AppModule, DepartmentAnnouncement } from '../types';

export const DEFAULT_MODULES: AppModule[] = [
  {
    id: 'data-murid',
    orderNumber: 1,
    title: 'Data Murid',
    shortCode: 'DM-SSeMJ',
    category: 'murid',
    categoryLabel: 'Pengurusan Murid',
    description: 'Pangkalan data peribadi murid Seni Muzik SSeMJ Tingkatan 1 hingga 5, instrumen major & minor, rekod pencapaian gred muzik, serta maklumat waris.',
    url: 'https://muridssemj.vercel.app/',
    icon: 'Users',
    accentColor: 'indigo',
    gradient: 'from-indigo-600/20 via-indigo-500/10 to-transparent',
    badge: 'Tingkatan 1 - 5',
    notes: 'Kemas kini butiran murid setiap awal semester persekolahan dan selepas peperiksaan amali.',
    subLinks: [
      { id: 'dm-1', title: 'Buka Portal Data Murid', url: 'https://muridssemj.vercel.app/' }
    ]
  },
  {
    id: 'kehadiran-kelas',
    orderNumber: 2,
    title: 'Rekod Kehadiran Kelas Kesenian',
    shortCode: 'RKK-SSeMJ',
    category: 'pdp',
    categoryLabel: 'PdP Kesenian',
    description: 'Log kehadiran harian kelas teori muzik, kelas amali instrumen individu/seksyen, latihan orkestra simfoni, koir, dan ensembel muzik tradisional.',
    url: 'https://kehadiran-kesenian.vercel.app/',
    icon: 'ClipboardCheck',
    accentColor: 'emerald',
    gradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
    badge: 'Harian & Sesi Amali',
    notes: 'Wajib diisi oleh guru pembimbing atau ketua seksyen sebelum tamat waktu sesi latihan kesenian.',
    subLinks: [
      { id: 'rkk-1', title: 'Buka Rekod Kehadiran Kesenian', url: 'https://kehadiran-kesenian.vercel.app/' }
    ]
  },
  {
    id: 'pengurusan-aset',
    orderNumber: 3,
    title: 'Pengurusan Aset',
    shortCode: 'AST-SSeMJ',
    category: 'aset',
    categoryLabel: 'Fasiliti & Peralatan',
    description: 'Inventori instrumen muzik orkestra, alat muzik tradisional, sistem audio PA & studio rakaman, piano grand, bilik latihan cubicle, serta rekod pinjaman.',
    url: 'https://aset-ssemj.vercel.app/',
    icon: 'Music2',
    accentColor: 'amber',
    gradient: 'from-amber-600/20 via-amber-500/10 to-transparent',
    badge: 'Inventori & Pinjaman',
    notes: 'Pemeriksaan fizikal instrumen dijalankan secara berkala setiap 3 bulan dan sebelum cuti penggal.',
    subLinks: [
      { id: 'ast-1', title: 'Buka Portal Pengurusan Aset', url: 'https://aset-ssemj.vercel.app/' }
    ]
  },
  {
    id: 'pengurusan-asrama',
    orderNumber: 4,
    title: 'Pengurusan Asrama',
    shortCode: 'ASR-SSeMJ',
    category: 'asrama',
    categoryLabel: 'Hal Ehwal Asrama',
    description: 'Pengurusan kebajikan murid seni di asrama SSeMJ, jadual waktu prep latihan muzik malam, sistem permohonan outing, pulang bermalam, dan rekod warden.',
    url: 'https://asramassemj.vercel.app/',
    icon: 'Building2',
    accentColor: 'sky',
    gradient: 'from-sky-600/20 via-sky-500/10 to-transparent',
    badge: 'Kebajikan & Disiplin',
    notes: 'Waktu prep kendiri instrumen di bilik latihan muzik asrama: 8.30 malam - 10.30 malam.',
    subLinks: [
      { id: 'asr-1', title: 'Buka Portal Pengurusan Asrama', url: 'https://asramassemj.vercel.app/' }
    ]
  },
  {
    id: 'aktiviti-program',
    orderNumber: 5,
    title: 'Pengurusan Aktiviti dan Program',
    shortCode: 'AKT-SSeMJ',
    category: 'aktiviti',
    categoryLabel: 'Aktiviti & Persembahan',
    description: 'Takwim persembahan konsert tahunan Gala Muzik SSeMJ, jemputan persembahan rasmi JPN Johor, masterclass artis jemputan, dan pertandingan peringkat kebangsaan.',
    url: 'https://aktivitimuzik.vercel.app/',
    icon: 'Sparkles',
    accentColor: 'rose',
    gradient: 'from-rose-600/20 via-rose-500/10 to-transparent',
    badge: 'Konsert & Acara',
    notes: 'Sila semak takwim persembahan luar selewat-lewatnya 2 minggu sebelum tarikh acara berlangsung.',
    subLinks: [
      { id: 'akt-1', title: 'Buka Portal Aktiviti & Program', url: 'https://aktivitimuzik.vercel.app/' }
    ]
  },
  {
    id: 'erph',
    orderNumber: 6,
    title: 'ERPH',
    shortCode: 'RPH-SSeMJ',
    category: 'erph',
    categoryLabel: 'Akademik & Kurikulum',
    description: 'Sistem e-RPH digital bagi guru Seni Muzik. Merangkumi rancangan pengajaran harian amali/teori, evidens Pentaksiran Bilik Darjah (PBD), dan semakan pentadbir.',
    url: 'https://sistendz.netlify.app/',
    icon: 'BookOpen',
    accentColor: 'violet',
    gradient: 'from-violet-600/20 via-violet-500/10 to-transparent',
    badge: 'KSSM Seni Muzik',
    notes: 'Penghantaran e-RPH mingguan selewat-lewatnya pada setiap hari Jumaat jam 11.59 malam.',
    subLinks: [
      { id: 'rph-1', title: 'Buka Sistem ERPH', url: 'https://sistendz.netlify.app/' }
    ]
  },
  {
    id: 'plc',
    orderNumber: 7,
    title: 'PLC',
    shortCode: 'PLC-SSeMJ',
    category: 'pdp',
    categoryLabel: 'Pembangunan Guru',
    description: 'Professional Learning Community (PLC) Panitia Muzik SSeMJ bagi perkongsian amalan terbaik, lesson study, peer coaching, dan kolaborasi pengajaran guru.',
    url: 'https://fastidious-mermaid-d48b79.netlify.app/',
    icon: 'GraduationCap',
    accentColor: 'cyan',
    gradient: 'from-cyan-600/20 via-cyan-500/10 to-transparent',
    badge: 'Komuniti Pembelajaran',
    notes: 'Platform perbincangan dan pelaporan sesi PLC guru muzik SSeMJ.',
    subLinks: [
      { id: 'plc-1', title: 'Buka Portal PLC', url: 'https://fastidious-mermaid-d48b79.netlify.app/' }
    ]
  }
];

export const DEFAULT_ANNOUNCEMENTS: DepartmentAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Latihan Intensif Konsert Tahunan SSeMJ 2026',
    date: 'Hari ini, 08:30 malam',
    tag: 'Orkestra & Koir',
    type: 'urgent'
  },
  {
    id: 'ann-2',
    title: 'Peringatan Penghantaran e-RPH Minggu Ke-12',
    date: 'Jumaat ini, 11:59 malam',
    tag: 'Kurikulum',
    type: 'info'
  },
  {
    id: 'ann-3',
    title: 'Pemeriksaan & Servis Penyelenggaraan Piano Grand Auditorium',
    date: 'Khamis, 10:00 pagi',
    tag: 'Pengurusan Aset',
    type: 'success'
  }
];

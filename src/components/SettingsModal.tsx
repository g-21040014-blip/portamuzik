import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  PlusCircle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  LogIn,
  AlertCircle,
  Database
} from 'lucide-react';
import { AppModule, CategoryType } from '../types';
import { 
  getSpreadsheetId, 
  setSpreadsheetId, 
  getStoredAccessToken, 
  requestGoogleAccessToken, 
  fetchModulesFromGoogleSheet, 
  syncModulesToGoogleSheet, 
  appendModuleToGoogleSheet,
  DEFAULT_SPREADSHEET_ID
} from '../services/googleSheets';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string;
  onUpdateLogo: (newUrl: string) => void;
  onResetLogo: () => void;
  onAddModule: (newModule: AppModule) => void;
  onResetToDefault: () => void;
  nextOrder: number;
  currentModules: AppModule[];
  onModulesUpdated: (modules: AppModule[]) => void;
  initialTab?: 'sheets' | 'logo' | 'pautan' | 'sistem';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  logoUrl,
  onUpdateLogo,
  onResetLogo,
  onAddModule,
  onResetToDefault,
  nextOrder,
  currentModules,
  onModulesUpdated,
  initialTab = 'sheets'
}) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'logo' | 'pautan' | 'sistem'>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Sheet state
  const [sheetId, setSheetIdState] = useState<string>(getSpreadsheetId());
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState<boolean>(!!getStoredAccessToken());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // State untuk Tambah Pautan
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CategoryType>('lain-lain');
  const [badge, setBadge] = useState('Modul Tambahan');
  const [notes, setNotes] = useState('');
  const [accentColor, setAccentColor] = useState('amber');
  const [saveToSheetChecked, setSaveToSheetChecked] = useState<boolean>(true);

  useEffect(() => {
    setSheetIdState(getSpreadsheetId());
    setIsGoogleLoggedIn(!!getStoredAccessToken());
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setSuccessMsg(null);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(msg);
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleGoogleLogin = () => {
    requestGoogleAccessToken(
      (token) => {
        setIsGoogleLoggedIn(true);
        showNotification('Akaun Google berjaya disambungkan! Anda kini boleh menyimpan data terus ke Google Sheet.');
      },
      (err) => {
        showNotification(err?.message || 'Gagal menyambungkan akaun Google.', true);
      }
    );
  };

  const handleFetchFromSheet = async () => {
    setIsSyncing(true);
    try {
      const fetched = await fetchModulesFromGoogleSheet(sheetId);
      if (fetched.length > 0) {
        onModulesUpdated(fetched);
        showNotification(`Berjaya memuat ${fetched.length} pautan aplikasi dari Google Sheet!`);
      } else {
        showNotification('Google Sheet disambungkan tetapi tiada data baris dijumpai.', true);
      }
    } catch (err: any) {
      showNotification(err?.message || 'Gagal membaca data dari Google Sheet.', true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveAllToSheet = async () => {
    if (!isGoogleLoggedIn) {
      // Trigger login first
      requestGoogleAccessToken(
        async () => {
          setIsGoogleLoggedIn(true);
          await doSaveAllToSheet();
        },
        (err) => {
          showNotification(err?.message || 'Sila log masuk akaun Google untuk menyimpan.', true);
        }
      );
      return;
    }

    await doSaveAllToSheet();
  };

  const doSaveAllToSheet = async () => {
    setIsSyncing(true);
    try {
      await syncModulesToGoogleSheet(currentModules, sheetId);
      showNotification(`Semua ${currentModules.length} pautan berjaya disimpan & disegerakkan ke Google Sheet!`);
    } catch (err: any) {
      showNotification(err?.message || 'Ralat menyimpan ke Google Sheet.', true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateSheetId = (e: React.FormEvent) => {
    e.preventDefault();
    if (sheetId.trim()) {
      setSpreadsheetId(sheetId.trim());
      showNotification('ID Google Sheet berjaya dikemaskini!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showNotification('Saiz fail melebihi 8MB. Sila pilih imej yang lebih kecil.', true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onUpdateLogo(base64);
        showNotification('Logo sekolah berjaya dimuat naik & disimpan secara kekal pada header!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onUpdateLogo(customUrlInput.trim());
      showNotification('Pautan logo sekolah berjaya disimpan secara kekal!');
      setCustomUrlInput('');
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
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
      description: `Akses portal ${title.trim()} rasmi SSeMJ.`,
      url: url.trim(),
      icon: 'Music2',
      accentColor,
      gradient: `from-${accentColor}-600/20 via-${accentColor}-500/10 to-transparent`,
      badge: badge.trim() || 'Aplikasi Muzik',
      notes: notes.trim(),
      subLinks: [{ id: `sub-${Date.now()}`, title: `Buka ${title.trim()}`, url: url.trim() }],
      updatedAt: new Date().toISOString()
    };

    onAddModule(newModule);

    // If saveToSheet is checked, also save to Google Sheet
    if (saveToSheetChecked) {
      try {
        if (isGoogleLoggedIn) {
          await appendModuleToGoogleSheet(newModule, sheetId);
          showNotification(`Butang "${title}" berjaya ditambah & disimpan ke Google Sheet!`);
        } else {
          // If not logged in, prompt user
          showNotification(`Butang "${title}" ditambah. Sila log masuk Google di tab Google Sheet untuk simpan ke cloud.`);
        }
      } catch (err: any) {
        console.warn('Gagal append ke sheet:', err);
        showNotification(`Butang ditambah di portal, tetapi ralat menyimpan ke Google Sheet: ${err.message}`, true);
      }
    } else {
      showNotification(`Butang pautan "${title}" berjaya ditambah!`);
    }

    setTitle('');
    setUrl('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tetapan */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Settings className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Tetapan Portal</span>
                <span className="text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">
                  SSeMJ
                </span>
              </h3>
              <p className="text-xs text-slate-400">Google Sheet, muat naik logo kekal & pengurusan pautan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 sm:px-4 pt-2 gap-1 sm:gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`pb-2.5 px-2.5 sm:px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-2.5 px-2.5 sm:px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo Sekolah</span>
          </button>

          <button
            onClick={() => setActiveTab('pautan')}
            className={`pb-2.5 px-2.5 sm:px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'pautan'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Pautan</span>
          </button>

          <button
            onClick={() => setActiveTab('sistem')}
            className={`pb-2.5 px-2.5 sm:px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'sistem'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tetapan Semula</span>
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mx-4 mt-3 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-4 mt-3 p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB: GOOGLE SHEET (DATA SYNC & AUTOSAVE) */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              
              <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <p className="font-bold text-white mb-0.5 flex items-center gap-2">
                    <span>Pangkalan Data Google Sheet SSeMJ</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-semibold">
                      Aktif
                    </span>
                  </p>
                  <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                    Portal ini menggunakan Google Sheet rasmi untuk membaca pautan aplikasi dan menyimpan sebarang maklumat atau pautan baharu terus ke dalam hamparan.
                  </p>
                </div>
              </div>

              {/* ID Google Sheet Aktif */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    ID Google Sheet Aktif:
                  </label>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                  >
                    <span>Buka Hamparan Google</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sheetId}
                    onChange={(e) => setSheetIdState(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
                    placeholder="1glnj4Gvj08lHJqQvd8TcjOp9KkjcJWHkVuaJDYavcDs"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateSheetId}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                  >
                    Simpan ID
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Lalai: <code className="text-slate-400 font-mono">{DEFAULT_SPREADSHEET_ID}</code>
                </p>
              </div>

              {/* Status Log Masuk Google & Butang Tindakan */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Status Kuasa Simpanan:</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isGoogleLoggedIn 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {isGoogleLoggedIn ? 'Tersambung (Boleh Simpan)' : 'Belum Log Masuk'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Log masuk ke akaun Google anda membolehkan sistem menyimpan pautan baharu atau kemas kini terus ke dalam Google Sheet anda secara masa nyata.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {!isGoogleLoggedIn ? (
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log Masuk Google untuk Simpan</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-400" />
                      <span>Tukar / Perbaharui Sesi Google</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFetchFromSheet}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Segerak & Muat Semula dari Sheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAllToSheet}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Simpan Semua Pautan ke Sheet</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: LOGO SEKOLAH (UPLOAD & PERMANENT DISPLAY) */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <p className="font-semibold text-white mb-0.5">Paparan Kekal Pada Header & Portal</p>
                  <p className="text-slate-400 leading-relaxed">
                    Logo yang anda muat naik akan disimpan secara automatik dan dipamerkan secara kekal pada pengepala (header) dan bahagian atas portal bagi menggantikan sebarang lambang lalai.
                  </p>
                </div>
              </div>

              {/* Pratonton Logo Semasa */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <div className="w-24 h-24 rounded-2xl bg-white p-1.5 border-2 border-amber-400/60 shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={logoUrl} 
                    alt="Pratonton Logo Sekolah" 
                    className="w-full h-full object-contain"
                    onError={() => setPreviewError(true)}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Logo Semasa Aktif
                  </span>
                  <p className="text-xs text-slate-300 mb-2">
                    {logoUrl.startsWith('data:') 
                      ? 'Imej fail muat naik anda tersimpan secara kekal dalam pelayar.' 
                      : 'Menggunakan fail logo rasmi Sekolah Seni Malaysia Johor.'}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Muat Naik Fail Imej</span>
                    </button>

                    <button
                      type="button"
                      onClick={onResetLogo}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Gunakan Asal SSeMJ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Kawasan Seret / Tekan Muat Naik */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                  className="hidden"
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-400/70 bg-slate-950/40 hover:bg-slate-900/50 rounded-2xl p-6 text-center cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-2.5 text-amber-400 group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white mb-1">
                    Tekan di sini untuk memilih fail gambar logo
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Menyokong format JPG, PNG, WEBP atau SVG (Maksimum 8MB)
                  </p>
                </div>
              </div>

              {/* Atau Masukkan URL Imej Luar */}
              <form onSubmit={handleApplyUrl} className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Atau Tampal URL Imej Logo Luar:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://contoh.com/logo-ssemj.png"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!customUrlInput.trim()}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold border border-slate-700 transition"
                  >
                    Guna URL
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: TAMBAH PAUTAN BAHARU */}
          {activeTab === 'pautan' && (
            <form onSubmit={handleCreateModule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Nama Butang Aplikasi / Modul *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: REKOD MARKAH PEPERIKSAAN"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  URL Pautan (Google Sheet / Google Form / Vercel / Netlify) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="murid">Pengurusan Murid</option>
                    <option value="pdp">PdP Kesenian</option>
                    <option value="aset">Fasiliti & Peralatan</option>
                    <option value="asrama">Hal Ehwal Asrama</option>
                    <option value="aktiviti">Aktiviti & Persembahan</option>
                    <option value="erph">Akademik & Kurikulum</option>
                    <option value="lain-lain">Modul Khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Tema Warna Butang
                  </label>
                  <select
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="amber">Emas / Amber</option>
                    <option value="indigo">Indigo Kesenian</option>
                    <option value="emerald">Hijau Emerald</option>
                    <option value="sky">Biru Langit</option>
                    <option value="violet">Ungu Royal</option>
                    <option value="rose">Merah Karmin</option>
                    <option value="cyan">Sian Kesenian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Lencana (Badge)
                </label>
                <input
                  type="text"
                  placeholder="Cth: Modul Baharu, Portal SSeMJ"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Simpan terus ke Google Sheet Checkbox */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="save-to-sheet"
                  checked={saveToSheetChecked}
                  onChange={(e) => setSaveToSheetChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-400"
                />
                <label htmlFor="save-to-sheet" className="text-xs text-emerald-300 font-medium cursor-pointer">
                  Simpan maklumat pautan ini secara automatik ke Google Sheet ({sheetId.slice(0, 8)}...)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Butang & Simpan</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: TETAPAN SEMULA SISTEM */}
          {activeTab === 'sistem' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>Tetapkan Semula Pautan Aplikasi Asal</span>
                </h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Jika anda ingin memulihkan 7 senarai modul rasmi SSeMJ (Data Murid, Rekod Kehadiran, Pengurusan Aset, Pengurusan Asrama, Pengurusan Aktiviti, ERPH, PLC), klik butang di bawah.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onResetToDefault();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 text-xs font-bold transition flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pulihkan 7 Pautan Asal SSeMJ</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Pulihkan Logo Rasmi Asal SSeMJ</span>
                </h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Kembalikan logo pada pengepala dan bahagian atas ke grafik lencana rasmi Sekolah Seni Malaysia Johor.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onResetLogo();
                    showNotification('Logo dikembalikan ke grafik rasmi SSeMJ.');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Gunakan Semula Logo Vektor Asal</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Modal */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-mono text-emerald-400">Sheet: {sheetId.slice(0, 10)}...</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};


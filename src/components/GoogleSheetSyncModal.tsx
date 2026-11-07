import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Link2,
  Database,
  ArrowRight,
} from 'lucide-react';
import { AppLink } from '../types';
import { soundFx } from '../utils/audio';
import {
  downloadLinksCsv,
  fetchLinksFromGoogleSheet,
  parseCsvToLinks,
  DEFAULT_MASTER_GOOGLE_SHEET_URL,
} from '../utils/csvHelper';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: AppLink[];
  onApplyLinks: (newLinks: AppLink[]) => void;
  savedSheetUrl: string;
  onSaveSheetUrl: (url: string) => void;
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  links,
  onApplyLinks,
  savedSheetUrl,
  onSaveSheetUrl,
  autoSyncEnabled,
  onToggleAutoSync,
}) => {
  const [sheetUrl, setSheetUrl] = useState(savedSheetUrl || DEFAULT_MASTER_GOOGLE_SHEET_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewLinks, setPreviewLinks] = useState<AppLink[] | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);

  const APPS_SCRIPT_CODE = `function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  const headers = rows[0].map(h => String(h).trim().toLowerCase());
  const data = [];
  const findCol = (aliases, exclude) => headers.findIndex(h => {
    if (exclude && exclude.some(ex => h.includes(ex))) return false;
    return aliases.some(a => h.includes(a));
  });
  const catIdx = findCol(['kategori', 'category'], ['sub']);
  const subCatIdx = findCol(['sub kategori', 'sub category', 'subkategori', 'subcategory']);
  const titleIdx = headers.findIndex(h => h.includes('nama pautan') || h === 'nama' || h === 'tajuk');
  const urlIdx = headers.findIndex((h, idx) => idx !== titleIdx && (h === 'url' || h === 'link' || h === 'alamat' || h.includes('url')));
  const descIdx = findCol(['keterangan', 'description']);
  const badgeIdx = findCol(['badge', 'label']);
  const iconIdx = findCol(['ikon', 'icon']);
  const colorIdx = findCol(['warna', 'color']);
  const favIdx = findCol(['favourite', 'favorite']);
  const activeIdx = findCol(['aktif', 'status']);
  const idIdx = findCol(['id']);
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const title = titleIdx >= 0 ? row[titleIdx] : row[2];
    const url = urlIdx >= 0 ? row[urlIdx] : row[3];
    if (!title || !url) continue;
    const favVal = favIdx >= 0 ? String(row[favIdx]).toLowerCase().trim() : '';
    const isFav = ['ya', 'yes', 'true', '1'].includes(favVal);
    const actVal = activeIdx >= 0 ? String(row[activeIdx]).toLowerCase().trim() : '';
    const isActive = !['tidak', 'no', 'false', '0'].includes(actVal);
    data.push({
      id: idIdx >= 0 && row[idIdx] ? String(row[idIdx]) : 'app-' + i,
      title: String(title).trim(),
      category: catIdx >= 0 && row[catIdx] ? String(row[catIdx]).trim() : 'Kesenian & Muzik',
      subCategory: subCatIdx >= 0 && row[subCatIdx] ? String(row[subCatIdx]).trim() : '',
      url: String(url).trim(),
      description: descIdx >= 0 && row[descIdx] ? String(row[descIdx]).trim() : '',
      badgeText: badgeIdx >= 0 && row[badgeIdx] ? String(row[badgeIdx]).trim() : '',
      iconName: iconIdx >= 0 && row[iconIdx] ? String(row[iconIdx]).trim() : 'Music',
      color: colorIdx >= 0 && row[colorIdx] ? String(row[colorIdx]).toLowerCase().trim() : 'blue',
      isFavorite: isFav,
      isActive: isActive
    });
  }
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}`;

  if (!isOpen) return null;

  const handleDownloadExcelCsv = () => {
    soundFx.playClick();
    downloadLinksCsv(links, `ssemj_pautan_muzik_master_${new Date().toISOString().split('T')[0]}.csv`);
    setSuccessMsg('Template Excel/CSV berjaya dimuat turun! Sila muat naik ke Google Drive anda.');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleSyncFromGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      setErrorMsg('Sila masukkan pautan URL Google Sheet terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPreviewLinks(null);

    try {
      soundFx.playClick();
      const fetchedLinks = await fetchLinksFromGoogleSheet(sheetUrl.trim());
      onSaveSheetUrl(sheetUrl.trim());
      onApplyLinks(fetchedLinks);
      setPreviewLinks(fetchedLinks);
      soundFx.playSuccess();
      setSuccessMsg(
        `Berjaya menarik ${fetchedLinks.length} pautan daripada Google Sheets! Data aplikasi kini dikemas kini secara berpusat.`
      );
    } catch (err: any) {
      soundFx.playClick();
      setErrorMsg(err.message || 'Gagal memuat turun data daripada Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadLocalCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCsvToLinks(text);
        if (parsed.length > 0) {
          onApplyLinks(parsed);
          soundFx.playSuccess();
          setSuccessMsg(`Berjaya mengimport ${parsed.length} pautan daripada fail CSV/Excel!`);
          setPreviewLinks(parsed);
          setTimeout(() => setSuccessMsg(null), 4000);
        } else {
          setErrorMsg('Tiada pautan yang dijumpai dalam fail CSV tersebut. Sila semak format lajur fail.');
        }
      } catch {
        setErrorMsg('Gagal membaca fail CSV/Excel.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Penyelarasan Google Sheets & Excel</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Data Berpusat
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pautan automatik supaya semua pengguna di Vercel sentiasa mendapat pautan rasmi yang tetap.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Notification Messages */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Step 1: Muat Turun Template Excel */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Muat Turun Template Fail Excel / CSV
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {links.length} Pautan Semasa
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Muat turun fail spreadsheet yang lengkap dengan semua pautan, nama, kategori, ikon, dan status kegemaran. Anda boleh muat naik fail ini ke <strong>Google Drive</strong> anda untuk dijadikan master Google Sheet.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadExcelCsv}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Muat Turun Excel (.CSV) Master</span>
              </button>

              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Import Fail CSV Komputer</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleUploadLocalCsv}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Pilihan Kaedah Penyegerakan: Tab Google Apps Script vs Google Sheet CSV */}
          <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  ⚡
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Kaedah Paling Pantas & Stabil: Google Apps Script Web App</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-semibold">Disyorkan</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sifar masalah login/kebenaran Google. Terus selaras di PC & telefon secara automatik.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200">1. Kod Apps Script (Menyokong Lajur Sub Kategori):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowScriptCode(!showScriptCode)}
                    className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 rounded transition"
                  >
                    {showScriptCode ? 'Tutup Kod' : 'Lihat Kod'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(APPS_SCRIPT_CODE);
                      soundFx.playSuccess();
                      setSuccessMsg('Kod Apps Script (bersama sokongan Sub Kategori) berjaya disalin!');
                      setTimeout(() => setSuccessMsg(null), 4000);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition shadow-xs"
                  >
                    Salin Kod Ini
                  </button>
                </div>
              </div>

              {showScriptCode && (
                <div className="mt-2 p-2.5 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
                  <pre className="whitespace-pre-wrap">{APPS_SCRIPT_CODE}</pre>
                </div>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Langkah: Buka Google Sheet &gt; <strong>Extensions &gt; Apps Script</strong> &gt; Padam kod sedia ada &gt; Tampal kod di atas &gt; Klik <strong>Deploy &gt; New deployment &gt; Web app</strong> &gt; Tetapkan <em>Who has access: "Anyone"</em> &gt; Salin Web App URL ke kotak di bawah.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Masukkan Web App URL Apps Script (atau Pautan Google Sheet CSV):
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec ATAU pautan Google Sheet"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

              {sheetUrl.includes('/drive/folders/') && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-lg text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Perhatian: Anda memasukkan pautan FOLDER Google Drive!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Sistem memerlukan pautan <strong>FAIL Google Sheet</strong> (bukan folder). Sila buka folder Google Drive anda, klik dua kali pada fail Google Sheet di dalamnya, dan salin URL fail tersebut daripada palang alamat pelayar (bermula dengan <code>https://docs.google.com/spreadsheets/d/...</code>).
                  </p>
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline pt-0.5"
                  >
                    <span>Buka Folder Ini di Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-400">
                  Menyokong Google Apps Script Web App & Google Sheets CSV.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSheetUrl(DEFAULT_MASTER_GOOGLE_SHEET_URL);
                  }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Gunakan URL Default SSeMJ
                </button>
              </div>

            {/* Auto-sync Option */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => onToggleAutoSync(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-medium">
                  Segerak automatik dari Google Sheets setiap kali aplikasi dibuka (Disyorkan)
                </span>
              </label>
              <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
                Semua guru dan pelawat di Vercel akan mendapat senarai pautan terkini secara automatik daripada Google Sheet anda tanpa perlu deploy semula!
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSyncFromGoogleSheet}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Sedang Menarik Data daripada Google Sheets...' : 'Tarik & Segerak Data Sekarang'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview If Just Synced */}
          {previewLinks && (
            <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>Pratonton Pautan Yang Ditarik:</span>
                <span>{previewLinks.length} Pautan</span>
              </div>
              <div className="max-h-36 overflow-y-auto divide-y divide-emerald-100 dark:divide-emerald-900/60 text-xs">
                {previewLinks.slice(0, 10).map((l, idx) => (
                  <div key={l.id || idx} className="py-1.5 flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{l.title}</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-normal">({l.category})</span>
                    </div>
                    {l.isFavorite && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded shrink-0">
                        ⭐ Favourite
                      </span>
                    )}
                  </div>
                ))}
                {previewLinks.length > 10 && (
                  <div className="pt-1 text-[11px] text-slate-400 italic text-center">
                    ...dan {previewLinks.length - 10} lagi pautan.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Penyegerakan awan Google Drive & Google Sheets</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

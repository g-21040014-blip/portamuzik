/**
 * Google Sheets Integration Service for SSeMJ Music Portal
 * Spreadsheet ID: 1glnj4Gvj08lHJqQvd8TcjOp9KkjcJWHkVuaJDYavcDs
 */

import { AppModule, CategoryType } from '../types';

export const DEFAULT_SPREADSHEET_ID = '1glnj4Gvj08lHJqQvd8TcjOp9KkjcJWHkVuaJDYavcDs';
const SHEET_STORAGE_KEY = 'ssemj_google_sheet_id';
const TOKEN_STORAGE_KEY = 'ssemj_google_access_token';

// Color themes and icons matching module themes
const THEME_MAP: Record<string, { accentColor: string; gradient: string; category: CategoryType; categoryLabel: string; badge: string; icon: string }> = {
  'DATA MURID': {
    accentColor: 'indigo',
    gradient: 'from-indigo-600/20 via-indigo-500/10 to-transparent',
    category: 'murid',
    categoryLabel: 'Pengurusan Murid',
    badge: 'Tingkatan 1 - 5',
    icon: 'Users'
  },
  'REKOD KEHADIRAN KELAS KESENIAN': {
    accentColor: 'emerald',
    gradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
    category: 'pdp',
    categoryLabel: 'PdP Kesenian',
    badge: 'Harian & Sesi Amali',
    icon: 'ClipboardCheck'
  },
  'PENGURUSAN ASET': {
    accentColor: 'amber',
    gradient: 'from-amber-600/20 via-amber-500/10 to-transparent',
    category: 'aset',
    categoryLabel: 'Fasiliti & Peralatan',
    badge: 'Inventori & Pinjaman',
    icon: 'Music2'
  },
  'PENGURUSAN ASRAMA': {
    accentColor: 'sky',
    gradient: 'from-sky-600/20 via-sky-500/10 to-transparent',
    category: 'asrama',
    categoryLabel: 'Hal Ehwal Asrama',
    badge: 'Kebajikan & Disiplin',
    icon: 'Building2'
  },
  'PENGURUSAN AKTIVITI DAN PROGRAM': {
    accentColor: 'rose',
    gradient: 'from-rose-600/20 via-rose-500/10 to-transparent',
    category: 'aktiviti',
    categoryLabel: 'Aktiviti & Persembahan',
    badge: 'Konsert & Acara',
    icon: 'Sparkles'
  },
  'ERPH': {
    accentColor: 'violet',
    gradient: 'from-violet-600/20 via-violet-500/10 to-transparent',
    category: 'erph',
    categoryLabel: 'Akademik & Kurikulum',
    badge: 'KSSM Seni Muzik',
    icon: 'BookOpen'
  },
  'PLC': {
    accentColor: 'cyan',
    gradient: 'from-cyan-600/20 via-cyan-500/10 to-transparent',
    category: 'pdp',
    categoryLabel: 'Pembangunan Guru',
    badge: 'Professional Learning',
    icon: 'GraduationCap'
  }
};

export function getSpreadsheetId(): string {
  try {
    return localStorage.getItem(SHEET_STORAGE_KEY) || DEFAULT_SPREADSHEET_ID;
  } catch {
    return DEFAULT_SPREADSHEET_ID;
  }
}

export function setSpreadsheetId(id: string): void {
  try {
    localStorage.setItem(SHEET_STORAGE_KEY, id.trim());
  } catch (err) {
    console.warn('Cannot save spreadsheet ID', err);
  }
}

export function getStoredAccessToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Cannot store access token', err);
  }
}

/**
 * Parses CSV raw text into rows
 */
function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => {
    // Handle simple CSV splitting while respecting quotes if present
    const row: string[] = [];
    let inQuotes = false;
    let current = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    return row;
  });
}

/**
 * Converts Google Sheet rows into AppModule items
 */
export function mapSheetRowsToModules(rows: string[][]): AppModule[] {
  if (!rows || rows.length < 2) return [];

  // Find header index: Look for APLIKASI or LINK
  const header = rows[0].map(h => h.trim().toUpperCase());
  let appColIndex = header.findIndex(h => h.includes('APLIKASI') || h.includes('NAMA') || h.includes('TITLE') || h.includes('MODUL'));
  let linkColIndex = header.findIndex(h => h.includes('LINK') || h.includes('URL') || h.includes('PAUTAN'));

  if (appColIndex === -1) appColIndex = 0;
  if (linkColIndex === -1) linkColIndex = 1;

  const results: AppModule[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    
    const title = (row[appColIndex] || '').trim();
    const url = (row[linkColIndex] || '').trim();

    if (!title && !url) continue;

    const upperTitle = title.toUpperCase();
    const theme = THEME_MAP[upperTitle] || {
      accentColor: ['amber', 'emerald', 'sky', 'rose', 'indigo', 'violet', 'cyan'][i % 7],
      gradient: 'from-amber-600/20 via-amber-500/10 to-transparent',
      category: 'lain-lain' as CategoryType,
      categoryLabel: 'Aplikasi SSeMJ',
      badge: 'Portal Rasmi',
      icon: 'Music'
    };

    const id = `sheet-app-${i}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    results.push({
      id,
      orderNumber: i,
      title: title || `Aplikasi Muzik #${i}`,
      shortCode: title.slice(0, 4).toUpperCase(),
      category: theme.category,
      categoryLabel: theme.categoryLabel,
      description: `Akses aplikasi ${title} rasmi Sekolah Seni Malaysia Johor`,
      url: url || '#',
      icon: theme.icon,
      accentColor: theme.accentColor,
      gradient: theme.gradient,
      badge: theme.badge,
      subLinks: [
        { id: `${id}-1`, title: `Buka ${title}`, url: url || '#' }
      ]
    });
  }

  return results;
}

/**
 * Fetch rows from Google Sheet
 * 1. Tries Google Sheets REST API with OAuth token if available
 * 2. Falls back to public CSV export which allows instant loading
 */
export async function fetchModulesFromGoogleSheet(customSheetId?: string): Promise<AppModule[]> {
  const sheetId = customSheetId || getSpreadsheetId();
  const token = getStoredAccessToken();

  // Try Google Sheets REST API if token is present
  if (token) {
    try {
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:F50`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.values && data.values.length > 1) {
          return mapSheetRowsToModules(data.values);
        }
      }
    } catch (err) {
      console.warn('Google Sheets API call failed, falling back to CSV export', err);
    }
  }

  // Fallback to public CSV export endpoint
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&t=${Date.now()}`;
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Gagal memuat turun data dari Google Sheet (${response.statusText})`);
  }

  const csvText = await response.text();
  const parsedRows = parseCSV(csvText);
  return mapSheetRowsToModules(parsedRows);
}

/**
 * Saves all modules to Google Sheet (overwrites A1:B table)
 * Requires OAuth access token.
 */
export async function syncModulesToGoogleSheet(modules: AppModule[], customSheetId?: string): Promise<void> {
  const sheetId = customSheetId || getSpreadsheetId();
  const token = getStoredAccessToken();

  if (!token) {
    throw new Error('Sila log masuk ke akaun Google anda terlebih dahulu untuk menyimpan data ke Google Sheet.');
  }

  const values = [
    ['APLIKASI', 'LINK'],
    ...modules.map(m => [m.title.toUpperCase(), m.url])
  ];

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:B${values.length}?valueInputOption=USER_ENTERED`;
  const response = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: `A1:B${values.length}`,
      majorDimension: 'ROWS',
      values
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || response.statusText;
    throw new Error(`Ralat menyimpan ke Google Sheet: ${message}`);
  }
}

/**
 * Append a single new row to Google Sheet
 */
export async function appendModuleToGoogleSheet(module: AppModule, customSheetId?: string): Promise<void> {
  const sheetId = customSheetId || getSpreadsheetId();
  const token = getStoredAccessToken();

  if (!token) {
    throw new Error('Sila log masuk Google untuk menambah rekod baharu ke Google Sheet.');
  }

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:B:append?valueInputOption=USER_ENTERED`;
  const response = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [
        [module.title.toUpperCase(), module.url]
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || response.statusText;
    throw new Error(`Ralat menambah baris ke Google Sheet: ${message}`);
  }
}

/**
 * Initiates Google OAuth Token Client (Google Identity Services)
 */
export function requestGoogleAccessToken(onSuccess: (token: string) => void, onError?: (err: any) => void): void {
  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '433369615577-7k94crhhn35nkq7ftqamettgvm7ulkj2.apps.googleusercontent.com';

  if (!clientId) {
    if (onError) onError(new Error('VITE_GOOGLE_CLIENT_ID tidak ditemui dalam konfigurasi sistem.'));
    return;
  }

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    if (onError) onError(new Error('Google Identity Services client belum selesai dimuatkan. Sila cuba sebentar lagi.'));
    return;
  }

  try {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      callback: (response: any) => {
        if (response.error) {
          if (onError) onError(new Error(response.error_description || response.error));
          return;
        }
        if (response.access_token) {
          setStoredAccessToken(response.access_token);
          onSuccess(response.access_token);
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: '' });
  } catch (err) {
    if (onError) onError(err);
  }
}

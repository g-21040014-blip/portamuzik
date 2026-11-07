import { AppLink, CategoryType } from '../types';
import { isForbiddenCategory } from './categoryValidation';

// Standard CSV Headers in Bahasa Melayu and English aliases
export const CSV_HEADERS = [
  'Kategori',
  'Sub Kategori',
  'Nama Pautan',
  'URL',
  'Keterangan',
  'Label Badge',
  'Ikon',
  'Warna',
  'Favourite',
  'Aktif',
  'ID',
];

/**
 * Escapes a cell value for CSV (wrapping in quotes if it contains commas, quotes, or newlines)
 */
function escapeCsvCell(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports an array of AppLinks into a properly formatted CSV string with UTF-8 BOM.
 * Excel, Google Sheets, and LibreOffice will open this with correct formatting.
 */
export function exportLinksToCsv(links: AppLink[]): string {
  const headerRow = CSV_HEADERS.map(escapeCsvCell).join(',');
  const rows = links.map((link) => {
    return [
      escapeCsvCell(link.category || 'Kesenian & Muzik'),
      escapeCsvCell(link.subCategory || ''),
      escapeCsvCell(link.title || ''),
      escapeCsvCell(link.url || ''),
      escapeCsvCell(link.description || ''),
      escapeCsvCell(link.badgeText || ''),
      escapeCsvCell(link.iconName || 'Music'),
      escapeCsvCell(link.color || 'blue'),
      escapeCsvCell(link.isFavorite ? 'YA' : 'TIDAK'),
      escapeCsvCell(link.isActive !== false ? 'YA' : 'TIDAK'),
      escapeCsvCell(link.id || ''),
    ].join(',');
  });

  // \uFEFF is UTF-8 Byte Order Mark for Excel compatibility
  return '\uFEFF' + [headerRow, ...rows].join('\r\n');
}

/**
 * Triggers a browser download for the CSV file
 */
export function downloadLinksCsv(links: AppLink[], filename?: string): void {
  const csvContent = exportLinksToCsv(links);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `ssemj_pautan_muzik_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Robust CSV Line & Cell Parser handling quotes, commas, CRLF, and UTF-8 BOM
 */
export function parseCsvRows(csvText: string): string[][] {
  // Strip BOM if present
  let cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote ("")
          currentCell += '"';
          i++;
        } else {
          // Closing quote
          insideQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        if (nextChar === '\n') i++; // Handle CRLF
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  // Push last cell & row if remaining
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Converts parsed CSV rows into AppLink objects with column auto-detection
 */
export function parseCsvToLinks(csvText: string): AppLink[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headerRow = rows[0].map((h) => h.toLowerCase().trim());

  // Helper to find column index with exact match preference, avoiding partial conflicts (e.g. 'pautan' in 'nama pautan')
  const findCol = (aliases: string[], excludePhrases: string[] = []): number => {
    // 1. Exact match first
    const exact = headerRow.findIndex((h) => aliases.includes(h));
    if (exact >= 0) return exact;

    // 2. Partial match without excluded words
    return headerRow.findIndex((h) => {
      if (excludePhrases.some((ex) => h.includes(ex))) return false;
      return aliases.some((a) => h.includes(a));
    });
  };

  const catIdx = findCol(['kategori', 'category'], ['sub']);
  const subCatIdx = findCol(['sub kategori', 'sub-kategori', 'sub category', 'subkategori', 'subcategory']);
  const titleIdx = findCol(['nama pautan', 'nama', 'title', 'tajuk', 'aplikasi', 'app']);
  const urlIdx = findCol(['url', 'link', 'alamat', 'web', 'pautan'], ['nama pautan', 'kategori']);
  const descIdx = findCol(['keterangan', 'description', 'deskripsi', 'catatan']);
  const badgeIdx = findCol(['label badge', 'badge', 'label', 'tag']);
  const iconIdx = findCol(['ikon', 'icon']);
  const colorIdx = findCol(['warna', 'color']);
  const favIdx = findCol(['favourite', 'favorite', 'kegemaran', 'utama']);
  const activeIdx = findCol(['aktif', 'active', 'status']);
  const idIdx = findCol(['id']);

  const links: AppLink[] = [];
  const today = new Date().toISOString().split('T')[0];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip empty lines
    if (!row || row.length === 0 || row.every((c) => !c.trim())) continue;

    const rawTitle = titleIdx >= 0 ? row[titleIdx] : row[1] || '';
    const rawUrl = urlIdx >= 0 ? row[urlIdx] : row[2] || '';
    if (!rawTitle.trim() && !rawUrl.trim()) continue;

    let rawCategory = catIdx >= 0 ? row[catIdx] : row[0] || 'Kesenian & Muzik';
    if (!rawCategory.trim() || isForbiddenCategory(rawCategory)) {
      rawCategory = 'Kesenian & Muzik';
    }

    const rawSubCategory = subCatIdx >= 0 && row[subCatIdx] ? row[subCatIdx].trim() : undefined;
    const rawDesc = descIdx >= 0 ? row[descIdx] : row[3] || '';
    const rawBadge = badgeIdx >= 0 ? row[badgeIdx] : row[4] || '';
    const rawIcon = iconIdx >= 0 ? row[iconIdx] : row[5] || 'Music';
    const rawColor = (colorIdx >= 0 ? row[colorIdx] : row[6] || 'blue').toLowerCase() as AppLink['color'];
    const validColors: AppLink['color'][] = ['amber', 'blue', 'emerald', 'purple', 'rose', 'cyan', 'indigo', 'orange'];
    const finalColor = validColors.includes(rawColor) ? rawColor : 'blue';

    const rawFav = favIdx >= 0 ? row[favIdx] : '';
    const isFav = ['ya', 'yes', 'true', '1', 'y'].includes(rawFav.toLowerCase().trim());

    const rawActive = activeIdx >= 0 ? row[activeIdx] : '';
    const isActive = rawActive ? !['tidak', 'no', 'false', '0', 'n'].includes(rawActive.toLowerCase().trim()) : true;

    let finalUrl = rawUrl.trim();
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const rawId = idIdx >= 0 && row[idIdx] ? row[idIdx].trim() : `link-csv-${r}-${Date.now()}`;

    links.push({
      id: rawId,
      title: rawTitle.trim() || 'Aplikasi Muzik',
      category: rawCategory.trim() as CategoryType,
      subCategory: rawSubCategory || undefined,
      url: finalUrl || '#',
      description: rawDesc.trim() || 'Aplikasi pengurusan Seni Muzik SSeMJ.',
      badgeText: rawBadge.trim() || undefined,
      iconName: rawIcon.trim() || 'Music',
      color: finalColor,
      isFavorite: isFav,
      isActive: isActive,
      target: '_blank',
      lastUpdated: today,
    });
  }

  return links;
}

/**
 * Default Master Google Sheet URL if set by admin
 */
export const DEFAULT_MASTER_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1AnhnVsFmBOr_0lrYjYtG0fWDYjDoAxGgHjzNAfwvnrE/edit?gid=865994441#gid=865994441';

/**
 * Transforms any Google Sheet or Drive sharing URL into a direct CSV export URL.
 * Handles both standard Google Sheets, Google Drive files, and "Publish to web" links.
 */
export function convertGoogleSheetUrlToCsvUrl(inputUrl: string): string {
  const trimmed = inputUrl.trim();
  if (!trimmed) return '';

  // Detection: Google Drive FOLDER link (which contains files, not the spreadsheet directly)
  if (trimmed.includes('/drive/folders/')) {
    throw new Error(
      'Pautan yang dimasukkan ialah FOLDER Google Drive. Sila klik dan buka fail Google Sheet di dalam folder tersebut, kemudian salin pautan fail Google Sheet tersebut (URL bermula dengan https://docs.google.com/spreadsheets/d/...).'
    );
  }

  const cacheBuster = `_t=${Date.now()}`;

  // Case 1: Already a direct CSV export link or raw CSV file
  if (trimmed.includes('output=csv') || trimmed.includes('format=csv') || trimmed.includes('uc?export=download')) {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}${cacheBuster}`;
  }

  // Case 2: Google Sheets "Publish to web" HTML link
  // e.g. https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pubhtml
  if (trimmed.includes('/pubhtml')) {
    return `${trimmed.replace('/pubhtml', '/pub?output=csv')}&${cacheBuster}`;
  }

  // Case 3: Standard Google Sheets view or edit URL:
  // e.g. https://docs.google.com/spreadsheets/d/1AnhnVsFmBOr_0lrYjYtG0fWDYjDoAxGgHjzNAfwvnrE/edit?gid=865994441#gid=865994441
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const spreadsheetId = match[1];

    // Check if gid is specified
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch && gidMatch[1] ? gidMatch[1] : '0';

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}&${cacheBuster}`;
  }

  // Case 4: Google Drive direct file link:
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9-_]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}&${cacheBuster}`;
  }

  return trimmed;
}

/**
 * Fetches live links directly from a Google Apps Script Web App (JSON) OR Google Sheet CSV export URL.
 */
export async function fetchLinksFromGoogleSheet(sheetUrl: string): Promise<AppLink[]> {
  const trimmed = sheetUrl.trim();
  if (!trimmed) {
    throw new Error('Alamat URL Google Sheets / Apps Script tidak sah.');
  }

  // If user provides a Google Apps Script web app URL (e.g. https://script.google.com/macros/s/.../exec)
  if (trimmed.includes('script.google.com/macros/s/')) {
    const response = await fetch(trimmed, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Gagal memuat turun data dari Apps Script (Ralat ${response.status}: ${response.statusText})`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Direct array of AppLinks or objects
      return data.map((item: any, idx: number) => ({
        id: item.id || `appscript-${idx}-${Date.now()}`,
        title: item.title || item.nama || item['Nama Pautan'] || 'Aplikasi Muzik',
        category: (item.category || item.kategori || item['Kategori'] || 'Kesenian & Muzik') as CategoryType,
        subCategory: item.subCategory || item.subkategori || item['Sub Kategori'] || item['Sub-Kategori'] || undefined,
        url: item.url || item.link || item['URL'] || '#',
        description: item.description || item.keterangan || item['Keterangan'] || '',
        badgeText: item.badgeText || item.badge || item['Label Badge'] || undefined,
        iconName: item.iconName || item.icon || item['Ikon'] || 'Music',
        color: (item.color || item.warna || item['Warna'] || 'blue').toLowerCase(),
        isFavorite: item.isFavorite === true || String(item.favourite || item['Favourite']).toLowerCase() === 'ya',
        isActive: item.isActive !== false && String(item.aktif || item['Aktif']).toLowerCase() !== 'tidak',
        target: '_blank',
        lastUpdated: new Date().toISOString().split('T')[0],
      }));
    }
  }

  // Otherwise, use standard Google Sheet CSV Export
  const csvUrl = convertGoogleSheetUrlToCsvUrl(sheetUrl);
  if (!csvUrl) {
    throw new Error('Alamat URL Google Sheets tidak sah.');
  }

  const response = await fetch(csvUrl, {
    method: 'GET',
    headers: {
      Accept: 'text/csv, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Gagal memuat turun data daripada Google Sheets (Ralat ${response.status}: ${response.statusText}). Sila pastikan Google Sheet telah dikongsi kepada "Anyone with the link can view" (Semua orang dengan pautan boleh lihat) atau diterbitkan ke web sebagai CSV.`
    );
  }

  const csvText = await response.text();
  const parsedLinks = parseCsvToLinks(csvText);

  if (parsedLinks.length === 0) {
    throw new Error(
      'Tiada pautan yang dapat dibaca daripada fail Google Sheets ini. Sila pastikan baris pertama mengandungi tajuk lajur seperti Kategori, Nama Pautan, URL.'
    );
  }

  return parsedLinks;
}

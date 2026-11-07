/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  Star,
  RotateCcw,
  Music,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  Calendar,
  Users,
  Tag,
  ListCollapse,
} from 'lucide-react';
import { AppLink, CategoryType, ViewMode } from './types';
import { DEFAULT_SSEMJ_LINKS, CATEGORIES } from './data/defaultLinks';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnnouncementBar } from './components/AnnouncementBar';
import { LinkButtonRow } from './components/LinkButtonRow';
import { LinkGridCard } from './components/LinkGridCard';
import { AccordionCategoryGroup } from './components/AccordionCategoryGroup';
import { TopFeaturedLinks } from './components/TopFeaturedLinks';
import { LinkEditorModal } from './components/LinkEditorModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ManageLinksTab } from './components/ManageLinksTab';
import { PanduanTab } from './components/PanduanTab';
import { PreviewModal } from './components/PreviewModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { soundFx } from './utils/audio';
import { getCategoryIcon } from './utils/categoryIcons';
import { fetchLinksFromGoogleSheet, DEFAULT_MASTER_GOOGLE_SHEET_URL } from './utils/csvHelper';
import {
  subscribeToLinks,
  saveLinkToFirestore,
  deleteLinkFromFirestore,
  subscribeToCategories,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  seedInitialLinksIfEmpty,
  testConnection,
} from './services/firebase';

const STORAGE_KEY = 'ssemj_muzik_links_v5';
const CATEGORY_STORAGE_KEY = 'ssemj_custom_categories_v1';
const CATEGORY_LIST_STORAGE_KEY = 'ssemj_categories_list_v6';
const GOOGLE_SHEET_URL_STORAGE_KEY = 'ssemj_google_sheet_url_v3';
const GOOGLE_SHEET_AUTOSYNC_STORAGE_KEY = 'ssemj_google_sheet_autosync_v3';

export const DEFAULT_CATEGORIES: string[] = [
  'Kesenian & Muzik',
  'Akademik & PdP',
  'Hal Ehwal Murid',
  'Kokurikulum',
  'Aset & Fasiliti',
  'Pentadbiran & Guru',
  'Jaringan & Jalinan',
  'KBAT',
  'PLC',
  'Sk@S',
  'OPR',
  'Appsheet',
];

export const isBannedCategory = (cat: string | undefined | null): boolean => {
  if (!cat) return false;
  const lower = cat.trim().toLowerCase();
  return (
    lower.includes('takwim') ||
    lower.includes('takwin') ||
    lower.includes('2027') ||
    lower.includes('2007')
  );
};

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'manage' | 'panduan'>('dashboard');

  // Sidebar collapsible & mobile drawer state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fully customizable category list state (Tambah, Edit, Padam Kategori)
  const [categoriesList, setCategoriesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORY_LIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: string) => !isBannedCategory(c));
        }
      }
      const legacySaved = localStorage.getItem(CATEGORY_STORAGE_KEY);
      if (legacySaved) {
        const parsedLegacy = JSON.parse(legacySaved);
        if (Array.isArray(parsedLegacy)) {
          const merged = [...DEFAULT_CATEGORIES];
          parsedLegacy.forEach((c: string) => {
            if (!isBannedCategory(c) && !merged.includes(c)) {
              merged.push(c);
            }
          });
          return merged;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CATEGORIES;
  });

  // Modal Category Manager state
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // Modal Google Sheet Sync state & preferences
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(GOOGLE_SHEET_URL_STORAGE_KEY) || DEFAULT_MASTER_GOOGLE_SHEET_URL;
    } catch {
      return DEFAULT_MASTER_GOOGLE_SHEET_URL;
    }
  });
  const DELETED_LINKS_STORAGE_KEY = 'ssemj_deleted_link_ids_v2';
  const [deletedLinkIds, setDeletedLinkIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ssemj_deleted_link_ids_v2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(GOOGLE_SHEET_AUTOSYNC_STORAGE_KEY);
      return stored === 'true'; // Default to false so user local edits are never overwritten by background sync
    } catch {
      return false;
    }
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Application links state initialized from localStorage
  const [links, setLinks] = useState<AppLink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map((item: AppLink) => {
            if (isBannedCategory(item.category)) {
              return { ...item, category: 'Kokurikulum' as CategoryType };
            }
            if (item.id === 'link-aktiviti-program' && (item.category === ('Kesenian & Muzik' as CategoryType) || isBannedCategory(item.category))) {
              return { ...item, category: 'Kokurikulum' as CategoryType };
            }
            if (item.id === 'link-plc' && item.category === ('Pentadbiran & Guru' as CategoryType)) {
              return { ...item, category: 'PLC' as CategoryType };
            }
            if (item.id === 'link-skas' && item.category === ('Pentadbiran & Guru' as CategoryType)) {
              return { ...item, category: 'Sk@S' as CategoryType };
            }
            return item;
          });

          // Ensure official OPR link is available if not present
          if (!list.some((l: AppLink) => l.id === 'link-opr' || l.category === 'OPR')) {
            const oprDefault = DEFAULT_SSEMJ_LINKS.find((l) => l.id === 'link-opr');
            if (oprDefault) list.push(oprDefault);
          }

          // Ensure official Appsheet link is available if not present
          if (!list.some((l: AppLink) => l.id === 'link-appsheet' || l.category === 'Appsheet')) {
            const appsheetDefault = DEFAULT_SSEMJ_LINKS.find((l) => l.id === 'link-appsheet');
            if (appsheetDefault) list.push(appsheetDefault);
          }
          return list;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SSEMJ_LINKS;
  });

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('accordion'); // Greenwich Accordion style as in reference image!

  // Open / collapsed states for accordion categories
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => ({
    'Kesenian & Muzik': true,
    'Akademik & PdP': true,
    'Hal Ehwal Murid': true,
    'Kokurikulum': true,
    'Aset & Fasiliti': true,
    'Pentadbiran & Guru': true,
    'PLC': true,
    'Sk@S': true,
    'OPR': true,
    'Appsheet': true,
  }));

  const handleToggleCategory = (catName: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    allCategoryItems.forEach((c) => {
      if (c.value !== 'Semua') next[c.value] = true;
    });
    setOpenCategories(next);
  };

  const handleCollapseAll = () => {
    setOpenCategories({});
  };

  // Dynamic merged category items (standard + customized categories from state & links)
  const allCategoryItems = useMemo(() => {
    const list: { label: string; value: string }[] = [
      { label: 'Semua Aplikasi', value: 'Semua' },
      ...categoriesList
        .filter((c) => !isBannedCategory(c))
        .map((c) => ({ label: c, value: c })),
    ];
    const existingValues = new Set(list.map((c) => c.value));

    // Add categories from existing links if any custom link has a new category
    links.forEach((l) => {
      if (
        l.category &&
        !isBannedCategory(l.category) &&
        !existingValues.has(l.category)
      ) {
        existingValues.add(l.category);
        list.push({ label: l.category, value: l.category });
      }
    });

    return list.filter((c) => !isBannedCategory(c.value) && !isBannedCategory(c.label));
  }, [categoriesList, links]);

  // Compute all available subcategories across all links and common presets
  const allSubCategories = useMemo(() => {
    const defaultSubs = [
      'Kelab & Persatuan',
      'Sukan & Permainan',
      'Badan Beruniform',
      'Peperiksaan & Bank Soalan',
      'Skor Digital',
      'Muzik Tradisional',
      'Muzik Moden',
      'Tingkatan 1',
      'Tingkatan 2',
      'Tingkatan 3',
      'Tingkatan 4',
      'Tingkatan 5',
    ];
    const fromLinks = links
      .map((l) => l.subCategory?.trim())
      .filter((s): s is string => Boolean(s && s.length > 0));

    const combined = Array.from(new Set([...defaultSubs, ...fromLinks]));
    return combined.sort((a, b) => a.localeCompare(b, 'ms'));
  }, [links]);

  // Category Manager Handlers (Tambah, Edit, Padam)
  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || isBannedCategory(trimmed)) return;
    setCategoriesList((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      const next = [...prev, trimmed];
      try {
        localStorage.setItem(CATEGORY_LIST_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    saveCategoryToFirestore(trimmed).catch(() => {});
  };

  const handleAddNewCategory = handleAddCategory; // Backward compatibility

  const handleRenameCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || isBannedCategory(trimmed)) return;
    setCategoriesList((prev) => {
      const next = prev.map((c) => (c === oldName ? trimmed : c));
      try {
        localStorage.setItem(CATEGORY_LIST_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    saveCategoryToFirestore(trimmed).catch(() => {});
    deleteCategoryFromFirestore(oldName).catch(() => {});

    // Update all links under this category
    setLinks((prev) => {
      const updated = prev.map((l) => {
        if (l.category === oldName) {
          const mod = { ...l, category: trimmed as CategoryType };
          saveLinkToFirestore(mod).catch(() => {});
          return mod;
        }
        return l;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (selectedCategory === oldName) {
      setSelectedCategory(trimmed as CategoryType);
    }
  };

  const handleDeleteCategory = (catToDelete: string, fallbackCategory: string) => {
    setCategoriesList((prev) => {
      const next = prev.filter((c) => c !== catToDelete);
      try {
        localStorage.setItem(CATEGORY_LIST_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    deleteCategoryFromFirestore(catToDelete).catch(() => {});

    // Migrate links under deleted category to fallback
    setLinks((prev) => {
      const updated = prev.map((l) => {
        if (l.category === catToDelete) {
          const mod = { ...l, category: fallbackCategory as CategoryType };
          saveLinkToFirestore(mod).catch(() => {});
          return mod;
        }
        return l;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (selectedCategory === catToDelete) {
      setSelectedCategory('Semua');
    }
  };

  const handleResetCategoriesToDefaults = () => {
    setCategoriesList(DEFAULT_CATEGORIES);
    try {
      localStorage.setItem(CATEGORY_LIST_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    } catch {}
  };

  // Audio state
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<AppLink | null>(null);
  const [previewLink, setPreviewLink] = useState<AppLink | null>(null);

  // Clear any existing dark mode setting & purge unwanted categories like Takwim / Takwin 2027
  useEffect(() => {
    try {
      localStorage.removeItem('ssemj_theme_mode');

      // Purge from stored custom categories
      const savedCats = localStorage.getItem(CATEGORY_STORAGE_KEY);
      if (savedCats) {
        const parsedCats = JSON.parse(savedCats);
        if (Array.isArray(parsedCats)) {
          const cleaned = parsedCats.filter((c: string) => !isBannedCategory(c));
          localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(cleaned));
        }
      }

      // Purge from stored links
      const savedLinks = localStorage.getItem(STORAGE_KEY);
      if (savedLinks) {
        const parsedLinks = JSON.parse(savedLinks);
        if (Array.isArray(parsedLinks)) {
          let hasBanned = false;
          const cleanedLinks = parsedLinks.map((l: AppLink) => {
            if (isBannedCategory(l.category)) {
              hasBanned = true;
              return { ...l, category: 'Kokurikulum' as CategoryType };
            }
            return l;
          });
          if (hasBanned) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedLinks));
          }
        }
      }
    } catch {}
    document.documentElement.classList.remove('dark');

    if (isBannedCategory(selectedCategory)) {
      setSelectedCategory('Semua');
    }
  }, []);

  // Real-time Cloud Synchronization via Firebase Firestore
  useEffect(() => {
    let unsubscribeLinks: (() => void) | null = null;
    let unsubscribeCats: (() => void) | null = null;

    const initFirebase = async () => {
      try {
        await testConnection();
        // Seed initial links to Firestore if cloud collection is empty
        await seedInitialLinksIfEmpty(links.length > 0 ? links : DEFAULT_SSEMJ_LINKS);

        // Listen to live links changes across all users and devices
        unsubscribeLinks = subscribeToLinks((cloudLinks) => {
          if (cloudLinks && cloudLinks.length > 0) {
            setLinks(cloudLinks);
            setIsCloudSynced(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudLinks));
            } catch {}
          }
        });

        // Listen to live custom categories
        unsubscribeCats = subscribeToCategories((cloudCats) => {
          if (cloudCats && cloudCats.length > 0) {
            setCategoriesList((prev) => {
              const combined = [...prev];
              cloudCats.forEach((c) => {
                if (!combined.includes(c) && !isBannedCategory(c)) combined.push(c);
              });
              return combined;
            });
          }
        });
      } catch (err) {
        console.warn('Firebase initialization error, running in local mode:', err);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribeLinks) unsubscribeLinks();
      if (unsubscribeCats) unsubscribeCats();
    };
  }, []);

  // Merge remote fetched links with local user additions/edits so user data is never lost
  const mergeLinks = (prevLinks: AppLink[], fetchedLinks: AppLink[]): AppLink[] => {
    // 1. Exclude any fetched link that was deleted locally by user
    const validFetched = fetchedLinks.filter((fl) => !deletedLinkIds.includes(fl.id));

    // 2. Map of user-modified links by ID and by alt key (title + url)
    const modifiedMap = new Map<string, AppLink>();
    prevLinks.forEach((pl) => {
      if (pl.isLocallyModified) {
        modifiedMap.set(pl.id, pl);
        const altKey = `${pl.title.trim().toLowerCase()}:::${pl.url.trim()}`;
        modifiedMap.set(altKey, pl);
      }
    });

    // 3. Keep local custom links created by the user that aren't in the remote sheet
    const localOnlyLinks = prevLinks.filter((pl) => {
      if (deletedLinkIds.includes(pl.id)) return false;
      const inFetched = validFetched.some(
        (fl) =>
          fl.id === pl.id ||
          (fl.title.trim().toLowerCase() === pl.title.trim().toLowerCase() && fl.url.trim() === pl.url.trim())
      );
      return !inFetched;
    });

    // 4. For fetched links, prioritize local modifications if user edited them
    const updatedFetched = validFetched.map((fl) => {
      const byId = modifiedMap.get(fl.id);
      if (byId) return byId;
      const altKey = `${fl.title.trim().toLowerCase()}:::${fl.url.trim()}`;
      const byKey = modifiedMap.get(altKey);
      if (byKey) return byKey;
      return fl;
    });

    return [...localOnlyLinks, ...updatedFetched];
  };

  // Realtime synchronization: background polling (only if user explicitly enables auto-sync)
  useEffect(() => {
    if (!autoSyncEnabled || !googleSheetUrl.trim()) return;

    let isSubscribed = true;

    const performSync = async () => {
      if (!isSubscribed) return;
      try {
        setSyncStatus('syncing');
        const fetched = await fetchLinksFromGoogleSheet(googleSheetUrl.trim());
        if (!isSubscribed) return;

        if (fetched && fetched.length > 0) {
          setLinks((prev) => {
            const merged = mergeLinks(prev, fetched);
            const prevStr = JSON.stringify(prev);
            const nextStr = JSON.stringify(merged);
            if (prevStr !== nextStr) {
              try {
                localStorage.setItem(STORAGE_KEY, nextStr);
              } catch {}
              return merged;
            }
            return prev;
          });
          setSyncStatus('synced');
          setSyncError(null);
          setLastSyncedTime(new Date());
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        setSyncStatus('error');
        setSyncError(err.message || 'Gagal menyegerak data daripada Google Sheets.');
      }
    };

    // Polling interval every 60 seconds only when auto-sync is explicitly enabled
    const intervalId = setInterval(performSync, 60000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [googleSheetUrl, autoSyncEnabled, deletedLinkIds]);

  const handleSaveGoogleSheetUrl = (url: string) => {
    setGoogleSheetUrl(url);
    try {
      localStorage.setItem(GOOGLE_SHEET_URL_STORAGE_KEY, url);
    } catch {}
  };

  const handleToggleAutoSync = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    try {
      localStorage.setItem(GOOGLE_SHEET_AUTOSYNC_STORAGE_KEY, String(enabled));
    } catch {}
  };

  const handleApplyGoogleSheetLinks = (newLinks: AppLink[]) => {
    setLinks((prev) => {
      const merged = mergeLinks(prev, newLinks);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  // Handlers for Links
  const handleSaveLink = (savedLink: AppLink) => {
    const enrichedLink: AppLink = { ...savedLink, isLocallyModified: true };
    setLinks((prev) => {
      const existingIdx = prev.findIndex((l) => l.id === enrichedLink.id);
      let next: AppLink[];
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = enrichedLink;
      } else {
        next = [enrichedLink, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Real-time Cloud Firestore save
    saveLinkToFirestore(enrichedLink).catch((err) => {
      console.warn('Gagal menyimpan pautan ke Firestore:', err);
    });
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setDeletedLinkIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(DELETED_LINKS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Real-time Cloud Firestore delete
    deleteLinkFromFirestore(id).catch((err) => {
      console.warn('Gagal memadam pautan dari Firestore:', err);
    });
  };

  const handleToggleFavorite = (id: string) => {
    setLinks((prev) => {
      const next = prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, isFavorite: !l.isFavorite, isLocallyModified: true };
          saveLinkToFirestore(updated).catch(() => {});
          return updated;
        }
        return l;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleActive = (id: string) => {
    setLinks((prev) => {
      const next = prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, isActive: !l.isActive, isLocallyModified: true };
          saveLinkToFirestore(updated).catch(() => {});
          return updated;
        }
        return l;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    soundFx.playClick();
    setLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= links.length - 1) return;
    soundFx.playClick();
    setLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Reorder links within their category
  const handleMoveLinkWithinCategory = (linkId: string, direction: 'up' | 'down') => {
    soundFx.playClick();
    setLinks((prev) => {
      const targetLink = prev.find((l) => l.id === linkId);
      if (!targetLink) return prev;

      const sameCategoryLinks = prev.filter((l) => l.category === targetLink.category);
      const catIndex = sameCategoryLinks.findIndex((l) => l.id === linkId);

      if (direction === 'up' && catIndex <= 0) return prev;
      if (direction === 'down' && catIndex >= sameCategoryLinks.length - 1) return prev;

      const swapTarget = direction === 'up'
        ? sameCategoryLinks[catIndex - 1]
        : sameCategoryLinks[catIndex + 1];

      const targetGlobalIndex = prev.findIndex((l) => l.id === targetLink.id);
      const swapGlobalIndex = prev.findIndex((l) => l.id === swapTarget.id);

      const copy = [...prev];
      copy[targetGlobalIndex] = swapTarget;
      copy[swapGlobalIndex] = targetLink;
      return copy;
    });
  };

  // Reorder favourite links
  const handleMoveFavoriteLink = (linkId: string, direction: 'up' | 'down') => {
    soundFx.playClick();
    setLinks((prev) => {
      const favs = prev.filter((l) => l.isFavorite);
      const favIndex = favs.findIndex((l) => l.id === linkId);

      if (direction === 'up' && favIndex <= 0) return prev;
      if (direction === 'down' && favIndex >= favs.length - 1) return prev;

      const swapTarget = direction === 'up' ? favs[favIndex - 1] : favs[favIndex + 1];
      const targetGlobalIndex = prev.findIndex((l) => l.id === linkId);
      const swapGlobalIndex = prev.findIndex((l) => l.id === swapTarget.id);

      const targetLink = prev[targetGlobalIndex];
      const copy = [...prev];
      copy[targetGlobalIndex] = swapTarget;
      copy[swapGlobalIndex] = targetLink;
      return copy;
    });
  };

  // Reorder categories
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    soundFx.playClick();
    setCategoriesList((prev) => {
      if (direction === 'up' && index <= 0) return prev;
      if (direction === 'down' && index >= prev.length - 1) return prev;

      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;

      try {
        localStorage.setItem(CATEGORY_LIST_STORAGE_KEY, JSON.stringify(copy));
      } catch {}
      return copy;
    });
  };

  const handleResetToDefaults = () => {
    setLinks(DEFAULT_SSEMJ_LINKS);
    setDeletedLinkIds([]);
    try {
      localStorage.removeItem(DELETED_LINKS_STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SSEMJ_LINKS));
    } catch {}
  };

  const handleExportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(links, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ssemj_muzik_links_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLinks(parsed);
          soundFx.playSuccess();
          alert('Konfigurasi pautan berjaya diimport!');
        } else {
          alert('Format fail JSON tidak sah.');
        }
      } catch {
        alert('Gagal membaca fail konfigurasi.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered links for main dashboard
  const displayedLinks = useMemo(() => {
    return links.filter((l) => {
      if (!l.isActive) return false;
      if (favoritesOnly && !l.isFavorite) return false;
      if (selectedCategory !== 'Semua' && l.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesDesc = l.description.toLowerCase().includes(q);
        const matchesCategory = l.category.toLowerCase().includes(q);
        const matchesSubCategory = l.subCategory ? l.subCategory.toLowerCase().includes(q) : false;
        const matchesUrl = l.url.toLowerCase().includes(q);
        const matchesBadge = l.badgeText ? l.badgeText.toLowerCase().includes(q) : false;
        return matchesTitle || matchesDesc || matchesCategory || matchesSubCategory || matchesUrl || matchesBadge;
      }

      return true;
    });
  }, [links, selectedCategory, searchQuery, favoritesOnly]);

  // Group displayed links by category for organized section display (Susun ikut kategori)
  const groupedLinks = useMemo(() => {
    const map = new Map<string, AppLink[]>();

    displayedLinks.forEach((link) => {
      const cat = link.category || 'Lain-lain';
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(link);
    });

    const result: { category: string; links: AppLink[] }[] = [];

    // Follow the category order in allCategoryItems
    allCategoryItems.forEach((c) => {
      if (c.value !== 'Semua' && map.has(c.value) && map.get(c.value)!.length > 0) {
        result.push({
          category: c.value,
          links: map.get(c.value)!,
        });
        map.delete(c.value);
      }
    });

    // Any remaining categories not in standard list
    map.forEach((cLinks, cName) => {
      if (cLinks.length > 0) {
        result.push({ category: cName, links: cLinks });
      }
    });

    return result;
  }, [displayedLinks, allCategoryItems]);

  // Top Featured Links: ALL active links marked as favorite!
  const topFeaturedLinks = useMemo(() => {
    return links.filter((l) => l.isActive && Boolean(l.isFavorite));
  }, [links]);

  // Displayed featured links respecting current category and search filter
  const displayedFeaturedLinks = useMemo(() => {
    let list = topFeaturedLinks;
    if (selectedCategory !== 'Semua') {
      list = list.filter((l) => l.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          (l.badgeText ? l.badgeText.toLowerCase().includes(q) : false)
      );
    }
    return list;
  }, [topFeaturedLinks, selectedCategory, searchQuery]);

  const totalActive = links.filter((l) => l.isActive).length;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* 1. Left Sidebar Navigation (Linear / Stripe style) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={allCategoryItems}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenAddModal={() => {
          setLinkToEdit(null);
          setIsEditorOpen(true);
        }}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenGoogleSheetsModal={() => setIsGoogleSheetModalOpen(true)}
        onExportConfig={handleExportConfig}
        totalLinksCount={totalActive}
      />

      {/* 2. Main Application Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => {
            setLinkToEdit(null);
            setIsEditorOpen(true);
          }}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
          onOpenGoogleSheetsModal={() => setIsGoogleSheetModalOpen(true)}
          isAudioOn={isAudioOn}
          setIsAudioOn={setIsAudioOn}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isCloudSynced={isCloudSynced}
        />

        {/* Global Announcement Banner */}
        <AnnouncementBar />

        {/* Main Workspace Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          {/* TAB 1: Papan Pemuka (Dashboard) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-3.5 max-w-2xl mx-auto">
              {/* Realtime Google Sheet Status Banner */}
              {googleSheetUrl.trim() && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold truncate text-emerald-950 dark:text-emerald-100">
                      Realtime Google Sheets Aktif
                    </span>
                    {lastSyncedTime && (
                      <span className="hidden sm:inline text-[11px] text-emerald-700 dark:text-emerald-400 font-normal">
                        · Disegerakkan {lastSyncedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setIsGoogleSheetModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:underline shrink-0"
                  >
                    Urus Pautan Sheet
                  </button>
                </div>
              )}

              {/* Filter & Toolbar Controls */}
              <div className="space-y-3 pt-1">
                {/* Search Bar & View Mode Switches */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari aplikasi: Kehadiran, Aset, Maklumat Murid, e-RPH, Sk@S..."
                      className="w-full pl-10 pr-12 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors shadow-xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Padam
                      </button>
                    )}
                  </div>

                  {/* Right: Favorites & View Switch */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Favorites Filter Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setFavoritesOnly(!favoritesOnly);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors shadow-xs ${
                        favoritesOnly
                          ? 'bg-amber-500 text-white border-amber-500 font-semibold shadow-amber-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : ''}`} />
                      <span>Kegemaran</span>
                    </button>

                    {/* View Switch: Accordion (Greenwich) vs List (Capsule) vs Grid */}
                    <div className="flex items-center p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setViewMode('accordion');
                        }}
                        title="Paparan Akordion Kategori (Gaya Greenwich Royal seperti dalam gambar)"
                        className={`p-1.5 rounded-md transition-colors ${
                          viewMode === 'accordion'
                            ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <ListCollapse className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setViewMode('list');
                        }}
                        title="Paparan Kapsul 3D"
                        className={`p-1.5 rounded-md transition-colors ${
                          viewMode === 'list'
                            ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <LayoutList className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setViewMode('grid');
                        }}
                        title="Paparan Kad Grid"
                        className={`p-1.5 rounded-md transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Urus Kategori Toolbar Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setIsCategoryManagerOpen(true);
                      }}
                      title="Tambah, Edit, atau Padam Kategori"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-xs"
                    >
                      <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="hidden sm:inline">Urus Kategori</span>
                      <span className="sm:hidden">Kategori</span>
                    </button>

                    {/* Manage Tab Shortcut */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab('manage');
                      }}
                      className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-xs"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span>Urus Pautan</span>
                    </button>
                  </div>
                </div>

                {/* Category Segmented Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {allCategoryItems.map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedCategory(cat.value as CategoryType);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Applications List / Grid Output */}
              {displayedLinks.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <Music className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Tiada aplikasi dijumpai
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                    Tiada pautan yang sepadan dengan kata carian atau kategori yang dipilih.
                  </p>
                  <div className="flex items-center justify-center gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('Semua');
                        setFavoritesOnly(false);
                      }}
                      className="px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors font-medium"
                    >
                      Set Semula Carian
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLinkToEdit(null);
                        setIsEditorOpen(true);
                      }}
                      className="px-3.5 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      + Tambah Pautan
                    </button>
                  </div>
                </div>
              ) : viewMode === 'accordion' ? (
                /* Greenwich Royal Accordion Style Matching Reference Screenshot */
                <div className="space-y-4 w-full">
                  {/* Top Direct Links Section (Link Favourite) */}
                  {displayedFeaturedLinks.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="px-1 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <span>Link Favourite</span>
                          {selectedCategory !== 'Semua' && (
                            <span className="text-[10px] font-normal text-blue-600 dark:text-blue-400">
                              · {selectedCategory}
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {displayedFeaturedLinks.length} Aplikasi
                        </span>
                      </div>
                      <TopFeaturedLinks
                        links={displayedFeaturedLinks}
                        onEdit={(l) => {
                          setLinkToEdit(l);
                          setIsEditorOpen(true);
                        }}
                        onDelete={handleDeleteLink}
                        onToggleFavorite={handleToggleFavorite}
                        onMoveLink={handleMoveFavoriteLink}
                      />
                    </div>
                  )}

                  {/* Accordion Categories Section (Matching bottom half of user screenshot) */}
                  <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Kategori Aplikasi (Akordion)
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {groupedLinks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            handleExpandAll();
                          }}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Buka Semua
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            handleCollapseAll();
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
                        >
                          Kuncup Semua
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {groupedLinks.map((group) => (
                        <AccordionCategoryGroup
                          key={group.category}
                          category={group.category}
                          links={group.links}
                          isOpen={Boolean(openCategories[group.category])}
                          onToggle={() => handleToggleCategory(group.category)}
                          onEdit={(l) => {
                            setLinkToEdit(l);
                            setIsEditorOpen(true);
                          }}
                          onDelete={handleDeleteLink}
                          onToggleFavorite={handleToggleFavorite}
                          onOpenPreview={(l) => setPreviewLink(l)}
                          onMoveLink={handleMoveLinkWithinCategory}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Organized Output - Grouped by Category (List / Grid) */
                <div className="space-y-4 w-full">
                  {/* Top Direct Links Section in List / Grid view */}
                  {displayedFeaturedLinks.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="px-1 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <span>Link Favourite</span>
                          {selectedCategory !== 'Semua' && (
                            <span className="text-[10px] font-normal text-blue-600 dark:text-blue-400">
                              · {selectedCategory}
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {displayedFeaturedLinks.length} Aplikasi
                        </span>
                      </div>
                      <TopFeaturedLinks
                        links={displayedFeaturedLinks}
                        onEdit={(l) => {
                          setLinkToEdit(l);
                          setIsEditorOpen(true);
                        }}
                        onDelete={handleDeleteLink}
                        onToggleFavorite={handleToggleFavorite}
                        onMoveLink={handleMoveFavoriteLink}
                      />
                    </div>
                  )}

                  {groupedLinks.map((group) => {
                    const CatIcon = getCategoryIcon(group.category);
                    return (
                      <div
                        key={group.category}
                        className="space-y-2 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
                      >
                        {/* Category Section Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100/60 dark:border-blue-500/20 shrink-0">
                              <CatIcon className="w-4 h-4" />
                            </div>
                            <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider truncate">
                              {group.category}
                            </h2>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                            {group.links.length} Pautan
                          </span>
                        </div>

                        {/* Category Link Buttons / Cards */}
                        {viewMode === 'list' ? (
                          <div className="space-y-1.5 w-full">
                            {group.links.map((link, idx) => (
                              <LinkButtonRow
                                key={link.id}
                                index={idx + 1}
                                link={link}
                                onEdit={(l) => {
                                  setLinkToEdit(l);
                                  setIsEditorOpen(true);
                                }}
                                onDelete={handleDeleteLink}
                                onToggleFavorite={handleToggleFavorite}
                                onOpenPreview={(l) => setPreviewLink(l)}
                                onMoveUp={idx > 0 ? () => handleMoveLinkWithinCategory(link.id, 'up') : undefined}
                                onMoveDown={idx < group.links.length - 1 ? () => handleMoveLinkWithinCategory(link.id, 'down') : undefined}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.links.map((link) => (
                              <LinkGridCard
                                key={link.id}
                                link={link}
                                onEdit={(l) => {
                                  setLinkToEdit(l);
                                  setIsEditorOpen(true);
                                }}
                                onDelete={handleDeleteLink}
                                onToggleFavorite={handleToggleFavorite}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Pengurusan Pautan (Urus & Tambah Link) */}
          {activeTab === 'manage' && (
            <ManageLinksTab
              links={links}
              onAddClick={() => {
                setLinkToEdit(null);
                setIsEditorOpen(true);
              }}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              onOpenGoogleSheetsModal={() => setIsGoogleSheetModalOpen(true)}
              onEditClick={(link) => {
                setLinkToEdit(link);
                setIsEditorOpen(true);
              }}
              onDeleteClick={handleDeleteLink}
              onToggleActive={handleToggleActive}
              onToggleFavorite={handleToggleFavorite}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onResetToDefaults={handleResetToDefaults}
              onExportConfig={handleExportConfig}
              onImportConfig={handleImportConfig}
            />
          )}

          {/* TAB 3: Panduan Guru */}
          {activeTab === 'panduan' && <PanduanTab />}
        </main>

        {/* Quiet SaaS Institutional Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/LOGO_SSEMJ_TAK_DE_NAMA_SEKOLAH_b4e0aa10.jfif"
                alt="Logo SSeMJ"
                className="w-5 h-5 object-contain shrink-0 drop-shadow-sm"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Unit Seni Muzik SSeMJ</span>
              <span aria-hidden="true" className="mx-1 text-slate-300 dark:text-slate-600">·</span>
              <span>Sekolah Seni Malaysia Johor</span>
              <span aria-hidden="true" className="mx-1 text-slate-300 dark:text-slate-600">·</span>
              <span>Kementerian Pendidikan Malaysia</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Papan Pemuka
              </button>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Pengurusan Pautan
              </button>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <button
                type="button"
                onClick={() => setActiveTab('panduan')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Panduan
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Link Editor Modal (Tambah / Edit) */}
      <LinkEditorModal
        isOpen={isEditorOpen}
        linkToEdit={linkToEdit}
        availableCategories={allCategoryItems.map((c) => c.value)}
        availableSubCategories={allSubCategories}
        onAddNewCategory={handleAddNewCategory}
        onClose={() => {
          setIsEditorOpen(false);
          setLinkToEdit(null);
        }}
        onSave={handleSaveLink}
      />

      {/* In-app Preview Modal */}
      <PreviewModal
        link={previewLink}
        onClose={() => setPreviewLink(null)}
      />

      {/* Category Manager Modal (Tambah, Edit, Padam Kategori) */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={allCategoryItems}
        links={links}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetCategoriesToDefaults={handleResetCategoriesToDefaults}
        onMoveCategory={handleMoveCategory}
      />

      {/* Google Sheet & Excel Sync Modal (Tarik Data Berpusat dari Google Drive) */}
      <GoogleSheetSyncModal
        isOpen={isGoogleSheetModalOpen}
        onClose={() => setIsGoogleSheetModalOpen(false)}
        links={links}
        onApplyLinks={handleApplyGoogleSheetLinks}
        savedSheetUrl={googleSheetUrl}
        onSaveSheetUrl={handleSaveGoogleSheetUrl}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={handleToggleAutoSync}
      />
    </div>
  );
}

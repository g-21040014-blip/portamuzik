export type CategoryType = 
  | 'Semua'
  | 'Akademik & PdP'
  | 'Kesenian & Muzik'
  | 'Hal Ehwal Murid'
  | 'Kokurikulum'
  | 'Aset & Fasiliti'
  | 'Pentadbiran & Guru'
  | 'PLC'
  | 'Sk@S'
  | 'OPR'
  | 'Appsheet'
  | (string & {});

export interface AppLink {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  url: string;
  iconName: string; // Lucide icon identifier
  color: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'orange';
  isFavorite?: boolean;
  isActive: boolean;
  target?: '_blank' | '_self';
  badgeText?: string;
  lastUpdated?: string;
  isLocallyModified?: boolean;
}

export type ViewMode = 'accordion' | 'list' | 'grid';

export type CategoryType = 
  | 'Semua'
  | 'Kesenian & Muzik'
  | 'Akademik & PdP'
  | 'Hal Ehwal Murid'
  | 'Kokurikulum'
  | 'Aset & Fasiliti'
  | 'Pentadbiran & Guru'
  | 'PLC'
  | 'Sk@S'
  | 'OPR'
  | 'semua'
  | 'murid'
  | 'pdp'
  | 'aset'
  | 'asrama'
  | 'aktiviti'
  | 'erph'
  | 'lain-lain'
  | string;

export type ViewMode = 'rows' | 'grid' | 'list' | 'accordion';

export interface AppLink {
  id: string;
  title: string;
  category: CategoryType;
  subCategory?: string;
  description: string;
  url: string;
  iconName: string;
  color: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'orange';
  isFavorite?: boolean;
  isActive?: boolean;
  target?: '_blank' | '_self';
  badgeText?: string;
  lastUpdated?: string;
  customIconUrl?: string;
}

export interface SubLink {
  id: string;
  title: string;
  url: string;
  iconName?: string;
}

export interface AppModule {
  id: string;
  orderNumber: number;
  title: string;
  shortCode: string;
  category: CategoryType;
  categoryLabel: string;
  description: string;
  url: string;
  icon: string;
  accentColor: string; // Tailwind color theme identifier
  gradient: string;
  badge: string;
  subLinks: SubLink[];
  isPinned?: boolean;
  notes?: string;
  updatedAt?: string;
}

export interface DepartmentAnnouncement {
  id: string;
  title: string;
  date: string;
  tag: string;
  type: 'urgent' | 'info' | 'success';
}

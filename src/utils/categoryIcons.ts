import React from 'react';
import {
  Music,
  Calendar,
  Layers,
  Award,
  FileSpreadsheet,
  BookOpen,
  Users,
  Building2,
  ShieldCheck,
  Smartphone,
  Tag,
} from 'lucide-react';

export const getCategoryIcon = (catValue: string): React.ElementType => {
  switch (catValue) {
    case 'Kesenian & Muzik':
      return Music;
    case 'Kokurikulum':
      return Calendar;
    case 'PLC':
      return Layers;
    case 'Sk@S':
      return Award;
    case 'OPR':
      return FileSpreadsheet;
    case 'Appsheet':
      return Smartphone;
    case 'Akademik & PdP':
      return BookOpen;
    case 'Hal Ehwal Murid':
      return Users;
    case 'Aset & Fasiliti':
      return Building2;
    case 'Pentadbiran & Guru':
      return ShieldCheck;
    default:
      return Tag;
  }
};

import React from 'react';
import {
  Users,
  ClipboardCheck,
  Music,
  Building,
  Calendar,
  BookOpen,
  Layers,
  Award,
  FileSpreadsheet,
  Sparkles,
  FolderGit2,
  Share2,
  Headphones,
  Mic2,
  Sliders,
  Radio,
  BellRing,
  Database,
  ShieldCheck,
  Library,
  ExternalLink,
  HelpCircle,
  GraduationCap,
  Piano,
  Disc,
  Smartphone,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Users,
  ClipboardCheck,
  Music,
  Building,
  Calendar,
  BookOpen,
  Layers,
  Award,
  FileSpreadsheet,
  Sparkles,
  FolderGit2,
  Share2,
  Headphones,
  Mic2,
  Sliders,
  Radio,
  BellRing,
  Database,
  ShieldCheck,
  Library,
  ExternalLink,
  GraduationCap,
  Piano,
  Disc,
  Smartphone,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[name] || Music || HelpCircle;
  return <IconComponent className={className} />;
};

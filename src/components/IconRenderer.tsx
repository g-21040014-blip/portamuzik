import React from 'react';
import { 
  Users, 
  ClipboardCheck, 
  Music2, 
  Music, 
  Building2, 
  Sparkles, 
  BookOpen, 
  FileSpreadsheet, 
  Calendar, 
  FolderKanban, 
  Layers, 
  GraduationCap, 
  Radio, 
  FileText,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case 'Users':
      return <Users className={className} />;
    case 'ClipboardCheck':
      return <ClipboardCheck className={className} />;
    case 'Music2':
      return <Music2 className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'FolderKanban':
      return <FolderKanban className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    default:
      return <Layers className={className} />;
  }
};

import type { FC } from 'react';
import { links } from '@/config/links';
import type { AppId } from '@/store/os';
import {
  FolderIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  NotesIcon,
  OutlookIcon,
} from './icons';

export interface DockItemDef {
  id: string;
  title: string;
  Icon: FC;

  app?: AppId;

  href?: string;

  home?: boolean;
}

// 추가: [독 항목]
export const DOCK_ITEMS: DockItemDef[] = [
  { id: 'notes', title: '메모', Icon: NotesIcon, app: 'notes' },
  {
    id: 'projects',
    title: '프로젝트',
    Icon: FolderIcon,
    app: 'projects',
    home: true,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    Icon: LinkedInIcon,
    href: links.linkedin,
  },
  {
    id: 'instagram',
    title: 'Instagram',
    Icon: InstagramIcon,
    href: links.instagram,
  },
  { id: 'outlook', title: 'Outlook', Icon: OutlookIcon, href: links.outlook },
  { id: 'github', title: 'GitHub', Icon: GithubIcon, href: links.github },
];

export const linkTarget = (href: string) =>
  href.startsWith('mailto:') ? undefined : '_blank';

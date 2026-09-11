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
  /** 창(아이폰에서는 전체 화면)으로 여는 앱 */
  app?: AppId;
  /** 새 탭으로 여는 주소. 비어 있으면 눌러도 아무 일 없다. */
  href?: string;
  /** 아이폰에서는 독(다섯 칸) 대신 홈 화면 격자에 이름을 달아 둔다. */
  home?: boolean;
}

/** 맥 독과 아이폰 독이 같이 쓴다. 순서가 곧 화면 순서다. */
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

/** 메일 주소는 새 탭을 띄우지 않고 메일 앱으로 넘긴다. */
export const linkTarget = (href: string) =>
  href.startsWith('mailto:') ? undefined : '_blank';

import type { ReactNode } from 'react';
import { noteCategories } from '@/config/notes';
import { useOS } from '@/store/os';
import { APP_ORDER, APPS } from './apps';
import { DOCK_ITEMS } from './dockItems';
import Glyph from './glyphs';
import { FolderGlyph } from './icons';
import { notes } from './notes';

export type SearchGroup = '애플리케이션' | '메모' | '프로젝트' | '링크';

export interface SearchItem {
  key: string;
  group: SearchGroup;
  title: string;
  sub?: string;
  icon: ReactNode;
  run: () => void;
}

const NOTE_CATEGORIES = new Set(noteCategories.map((c) => c.id));

export const searchItems = (query: string): SearchItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const { open, showNote, showProject } = useOS.getState();
  const hit = (...texts: (string | undefined)[]) =>
    texts.some((t) => t?.toLowerCase().includes(q));

  const apps = APP_ORDER.filter((id) => hit(APPS[id].title, id)).map(
    (id): SearchItem => {
      const { title, Icon } = APPS[id];
      return {
        key: `app:${id}`,
        group: '애플리케이션',
        title,
        icon: <Icon />,
        run: () => open(id),
      };
    },
  );
  const found = notes.filter((n) => hit(n.title, n.excerpt, n.body));
  const memo = found
    .filter((n) => NOTE_CATEGORIES.has(n.category))
    .map((n): SearchItem => ({
      key: `note:${n.id}`,
      group: '메모',
      title: n.title,
      sub: n.excerpt,
      icon: <Glyph name="doc" />,
      run: () => showNote(n.id),
    }));
  const projects = found
    .filter((n) => n.category === 'projects')
    .map((n): SearchItem => ({
      key: `project:${n.id}`,
      group: '프로젝트',
      title: n.title,
      sub: n.excerpt,
      icon: <FolderGlyph />,
      run: () => showProject(n.id),
    }));
  const links = DOCK_ITEMS.filter((d) => d.href && hit(d.title, d.href)).map(
    ({ id, title, Icon, href = '' }): SearchItem => ({
      key: `link:${id}`,
      group: '링크',
      title,
      sub: href.replace(/^mailto:/, ''),
      icon: <Icon />,
      run: () => {
        if (href.startsWith('mailto:')) location.href = href;
        else window.open(href, '_blank', 'noreferrer');
      },
    }),
  );
  return [...apps, ...memo, ...projects, ...links];
};

import type { ReactNode } from 'react';
import { useOS } from '@/store/os';
import { APP_ORDER, APPS } from './apps';
import { DOCK_ITEMS } from './dockItems';
import Glyph from './glyphs';
import { notes } from './notes';

export type SearchGroup = '애플리케이션' | '메모' | '링크';

export interface SearchItem {
  key: string;
  group: SearchGroup;
  title: string;
  sub?: string;
  icon: ReactNode;
  run: () => void;
}

/**
 * Spotlight(맥)와 검색(아이폰)이 같이 쓴다. 앱 · 메모 · 독의 링크를 찾는다.
 * 앱과 메모는 스토어의 open 으로 열어서, 맥에서는 창이, 아이폰에서는 전체 화면 앱이 뜬다.
 */
export const searchItems = (query: string): SearchItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const { open, showNote } = useOS.getState();
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
  const memo = notes
    .filter((n) => hit(n.title, n.excerpt, n.body))
    .map((n): SearchItem => ({
      key: `note:${n.id}`,
      group: '메모',
      title: n.title,
      sub: n.excerpt,
      icon: <Glyph name="doc" />,
      run: () => showNote(n.id),
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
  return [...apps, ...memo, ...links];
};

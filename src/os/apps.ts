import type { FC } from 'react';
import type { AppId } from '@/store/os';
import Notes from './apps/Notes';
import Projects from './apps/Projects';
import { FolderIcon, NotesIcon } from './icons';

export interface AppDef {
  title: string;
  Icon: FC;
  Body: FC;
}

// 추가: 창으로 여는 앱. store/os.ts 의 AppId 와 FRAMES 에도 같은 이름을 넣는다.
export const APPS: Record<AppId, AppDef> = {
  notes: { title: '메모', Icon: NotesIcon, Body: Notes },
  projects: { title: '프로젝트', Icon: FolderIcon, Body: Projects },
};

export const APP_ORDER: AppId[] = ['notes', 'projects'];

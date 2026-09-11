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

/** 창으로 여는 앱. 독의 나머지 항목은 바깥 링크다(os/dockItems.ts). */
export const APPS: Record<AppId, AppDef> = {
  notes: { title: '메모', Icon: NotesIcon, Body: Notes },
  projects: { title: '프로젝트', Icon: FolderIcon, Body: Projects },
};

export const APP_ORDER: AppId[] = ['notes', 'projects'];

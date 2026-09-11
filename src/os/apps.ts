import type { FC } from 'react';
import type { AppId } from '@/store/os';
import Notes from './apps/Notes';
import { NotesIcon } from './icons';

export interface AppDef {
  title: string;
  Icon: FC;
  Body: FC;
}

/** 창으로 여는 앱. 독의 나머지 항목은 바깥 링크다(os/dock.ts). */
export const APPS: Record<AppId, AppDef> = {
  notes: { title: '메모', Icon: NotesIcon, Body: Notes },
};

export const APP_ORDER: AppId[] = ['notes'];

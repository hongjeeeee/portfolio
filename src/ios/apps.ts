import type { FC } from 'react';
import { APPS } from '@/os/apps';
import type { AppId } from '@/store/os';

export interface PhoneAppDef {
  title: string;
  Icon: FC;
  Body: FC;

  darkChrome?: boolean;

  nav?: boolean;
}

// 추가: [아이폰 앱]
export const PHONE_APPS: Record<AppId, PhoneAppDef> = {
  notes: { ...APPS.notes, nav: true },

  projects: { ...APPS.projects },
};

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

// 추가: 아이폰에서 전체 화면으로 여는 앱. nav 를 켜면 위에 제목 막대가 생긴다.
export const PHONE_APPS: Record<AppId, PhoneAppDef> = {
  notes: { ...APPS.notes, nav: true },

  projects: { ...APPS.projects },
};

import type { FC } from 'react';
import { APPS } from '@/os/apps';
import type { AppId } from '@/store/os';

export interface PhoneAppDef {
  title: string;
  Icon: FC;
  Body: FC;
  /** 어두운 바탕 앱. 상태 바 글자와 홈 막대를 희게 칠한다. */
  darkChrome?: boolean;
  /** 위에 제목 막대를 둔다. */
  nav?: boolean;
}

/** 맥과 같은 앱을 그대로 전체 화면으로 연다. */
export const PHONE_APPS: Record<AppId, PhoneAppDef> = {
  notes: { ...APPS.notes, nav: true },
  // 파인더 도구 막대가 제목 막대를 겸한다.
  projects: { ...APPS.projects },
};

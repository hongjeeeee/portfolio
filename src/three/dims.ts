import { MathUtils, Vector3 } from 'three';

export const BASE = { w: 3.126, d: 2.212, h: 0.1, r: 0.11 } as const;

export const LID = { t: 0.045 } as const;

export const DISPLAY = { w: 3.025, h: 1.965, top: 0.052 } as const;
export const DISPLAY_ASPECT = DISPLAY.w / DISPLAY.h;

export const CHIN = BASE.d - DISPLAY.h - DISPLAY.top;

export const DISPLAY_Z = -LID.t / 2 + CHIN + DISPLAY.h / 2;

export const OPEN_ANGLE = MathUtils.degToRad(96);

export const FOV = 22;

export const HINGE = new Vector3(
  0,
  BASE.h + LID.t / 2,
  -BASE.d / 2 + LID.t / 2,
);

export const KEY_U = 0.19;
export const FN_ROW = 0.9;
export const KEYBOARD = {
  w: 14.5 * KEY_U,
  d: (FN_ROW + 5) * KEY_U,

  z: -BASE.d / 2 + 0.115 + ((FN_ROW + 5) * KEY_U) / 2,
};

export const MENUBAR_H = 28;

export const PHONE = { w: 0.706, h: 1.466, d: 0.0825, r: 0.098 } as const;

export const PHONE_DISPLAY = { w: 0.649, h: 1.407, r: 0.082 } as const;

export const PHONE_Y = PHONE.h / 2 + 0.12;

import { MathUtils, Vector3 } from 'three';

/**
 * 1 = 10cm. 14인치 MacBook Pro(2021~) 실측값에 맞췄다.
 * 가로 31.26cm · 깊이 22.12cm · 닫았을 때 두께 1.55cm.
 */
export const BASE = { w: 3.126, d: 2.212, h: 0.1, r: 0.11 } as const;

/** 뚜껑 두께. 바닥판과 합쳐 1.45cm — 고무 받침까지 치면 실측과 비슷하다. */
export const LID = { t: 0.045 } as const;

/** 화면 표시 영역. 14.2인치 대각선, 3024×1964 비율. */
export const DISPLAY = { w: 3.025, h: 1.965, top: 0.052 } as const;
export const DISPLAY_ASPECT = DISPLAY.w / DISPLAY.h;

/** 힌지 쪽 아래 베젤(턱). 뚜껑 깊이에서 화면과 위 베젤을 뺀 나머지다. */
export const CHIN = BASE.d - DISPLAY.h - DISPLAY.top;

/** 뚜껑 좌표계에서 화면 중심의 z. 뚜껑은 힌지 축(z=0)에서 +z 로 뻗는다. */
export const DISPLAY_Z = -LID.t / 2 + CHIN + DISPLAY.h / 2;

/**
 * 닫힌 상태 0 에서 이만큼 젖힌다. 카메라는 화면과 수직으로 서므로
 * 뚜껑이 누울수록 위에서 내려다보게 되어 키보드가 화면을 잡아먹는다.
 */
export const OPEN_ANGLE = MathUtils.degToRad(96);

/** 망원 화각. 멀리서 당겨 찍어야 바닥판이 눌려 보여 정면 제품 사진처럼 된다. */
export const FOV = 22;

/** 힌지 축. 바닥판 윗면 뒤쪽 모서리에서 뚜껑 두께 절반만큼 안쪽이다. */
export const HINGE = new Vector3(
  0,
  BASE.h + LID.t / 2,
  -BASE.d / 2 + LID.t / 2,
);

/** 키 한 칸(1u) 19mm. 한 줄은 14.5u 이고, 조금 낮은 기능키 줄 아래로 다섯 줄이 있다. */
export const KEY_U = 0.19;
export const FN_ROW = 0.9;
export const KEYBOARD = {
  w: 14.5 * KEY_U,
  d: (FN_ROW + 5) * KEY_U,
  /** 힌지에서 11.5mm 떨어져 시작한다 */
  z: -BASE.d / 2 + 0.115 + ((FN_ROW + 5) * KEY_U) / 2,
};

/** 가상 화면에서 메뉴 막대 높이(px). 노치 높이와 같다. */
export const MENUBAR_H = 28;

/** iPhone 15 Pro 실측. 146.6 × 70.6 × 8.25mm */
export const PHONE = { w: 0.706, h: 1.466, d: 0.0825, r: 0.098 } as const;

/** 6.1인치 화면, 2556×1179 비율. 모서리가 둥글어 DOM 도 같은 반지름으로 자른다. */
export const PHONE_DISPLAY = { w: 0.649, h: 1.407, r: 0.082 } as const;

/** 바닥에서 조금 띄워 세운다. 그림자가 발밑에 떨어진다. */
export const PHONE_Y = PHONE.h / 2 + 0.12;

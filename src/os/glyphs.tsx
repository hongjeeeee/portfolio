import type { ReactNode } from 'react';

/**
 * 메뉴 막대 · 제어 센터 · 창 버튼에 쓰는 아이콘. 전부 24×24 격자에 직접 그렸다.
 * 대부분 선 아이콘이고, 애플 상태 아이콘이 채워진 모양인 것(Wi-Fi · 제어 센터)은 채워 그린다.
 */

/** Wi-Fi 부채꼴. 한가운데 아래(12, 20)를 중심으로 두께 3.6 띠 두 줄과 끝의 쐐기. */
const wifiFan = (
  <>
    <path d="M2.1 9a14.8 14.8 0 0 1 19.8 0" strokeWidth="3.6" />
    <path d="M5.71 13.02a9.4 9.4 0 0 1 12.58 0" strokeWidth="3.6" />
    <path
      d="M12 20 8.52 16.14a5.2 5.2 0 0 1 6.96 0z"
      fill="currentColor"
      strokeWidth="1.2"
    />
  </>
);

const PATHS = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  wifi: wifiFan,
  wifiOff: (
    <>
      <g opacity=".35">{wifiFan}</g>
      <path d="m4 3.5 16 16" strokeWidth="2.2" />
    </>
  ),
  bluetooth: <path d="m7 7 10 10-5 4V3l5 4L7 17" />,
  airdrop: (
    <>
      <path d="M6.3 17.7a8 8 0 1 1 11.4 0" />
      <path d="M9.2 14.8a4 4 0 1 1 5.6 0" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  keyboardLight: (
    <>
      <rect x="3" y="11" width="18" height="9" rx="2" />
      <path d="M7 14.5h.01M11 14.5h.01M15 14.5h.01M8 17.2h8" />
      <path d="M12 3v3M7.3 4.5l1.2 2M16.7 4.5l-1.2 2" />
    </>
  ),
  fullscreen: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  fullscreenExit: <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />,
  volume: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  back: <path d="m15 5-7 7 7 7" />,
  forward: <path d="m9 5 7 7-7 7" />,
  reload: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 4v7h-7" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </>
  ),
  controlCenter: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="3.5" />
      <circle cx="7.5" cy="7.5" r="1.8" fill="currentColor" stroke="none" />
      {/* 아래 스위치는 켜진 모양: 칸을 채우고 손잡이 자리를 뚫는다. 크기는 위 칸의 선 바깥까지 맞춘다. */}
      <path
        d="M6.5 12.1h11a4.4 4.4 0 0 1 0 8.8h-11a4.4 4.4 0 0 1 0-8.8zm10 2.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z"
        fill="currentColor"
        fillRule="evenodd"
        stroke="none"
      />
    </>
  ),
  code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
  close: <path d="m7 7 10 10M17 7 7 17" />,
  minus: <path d="M6 12h12" />,
} satisfies Record<string, ReactNode>;

export type GlyphName = keyof typeof PATHS;

const Glyph = ({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: GlyphName;
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {PATHS[name]}
  </svg>
);

export default Glyph;

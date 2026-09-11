import { useId, type PropsWithChildren } from 'react';
import s from './style.module.css';

/**
 * 독 아이콘. 받은 그림을 보고 SVG 로 다시 그렸다. 크기는 부모의 font-size(1em)를 따른다.
 * 여러 곳에 동시에 그려지므로 그라데이션 id 는 useId 로 겹치지 않게 만든다.
 */
const Tile = ({ bg, children }: PropsWithChildren<{ bg: string }>) => (
  <span className={s.tile} style={{ background: bg }}>
    {children}
  </span>
);

/** 타일을 꽉 채우는 60×60 그림판 */
const Full = ({ children }: PropsWithChildren) => (
  <svg className={s.full} viewBox="0 0 60 60" aria-hidden>
    {children}
  </svg>
);

export const NotesIcon = () => {
  const top = useId();
  return (
    <Tile bg="#ffffff">
      <Full>
        <defs>
          <linearGradient id={top} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe36e" />
            <stop offset="1" stopColor="#f8c323" />
          </linearGradient>
        </defs>
        <rect width="60" height="16.5" fill={`url(#${top})`} />
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={4 + i * 5.2} cy="21" r="1.1" fill="#c7c7cc" />
        ))}
        <path d="M0 33.5h60M0 45.5h60" stroke="#dcdce0" strokeWidth="1" />
      </Full>
    </Tile>
  );
};

export const LinkedInIcon = () => (
  <Tile bg="linear-gradient(180deg, #1478d4, #0a5fb4)">
    <Full>
      <g fill="#fff">
        <circle cx="18.2" cy="17.6" r="4.1" />
        <rect x="14.6" y="24.6" width="7.2" height="21.4" rx="0.6" />
        <path d="M26.4 24.6h6.9v2.9c1.2-2.1 3.9-3.5 7-3.5 5.6 0 7.9 3.5 7.9 9.3V46h-7.2V34.6c0-2.9-.9-4.6-3.3-4.6-2.6 0-4.1 1.9-4.1 4.9V46h-7.2z" />
      </g>
    </Full>
  </Tile>
);

export const InstagramIcon = () => (
  <Tile bg="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)">
    <Full>
      <g fill="none" stroke="#fff" strokeWidth="4.2">
        <rect x="13" y="13" width="34" height="34" rx="10" />
        <circle cx="30" cy="30" r="8.2" />
      </g>
      <circle cx="40.6" cy="19.4" r="2.6" fill="#fff" />
    </Full>
  </Tile>
);

export const OutlookIcon = () => {
  const back = useId();
  const front = useId();
  return (
    <Tile bg="linear-gradient(180deg, #ffffff, #eaf1fa)">
      <Full>
        <defs>
          <linearGradient id={back} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3ccbf4" />
            <stop offset="1" stopColor="#1181d6" />
          </linearGradient>
          <linearGradient id={front} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f8fe3" />
            <stop offset="1" stopColor="#0a4fa3" />
          </linearGradient>
        </defs>
        {/* 뒤: 격자가 비치는 봉투 */}
        <rect
          x="21"
          y="12"
          width="29"
          height="36"
          rx="3.5"
          fill={`url(#${back})`}
        />
        <path
          d="M21 16.5h29M21 23.5h29M35.5 12v18"
          stroke="#fff"
          strokeOpacity=".28"
          strokeWidth="1.2"
        />
        <path d="M21 30h29v15a3 3 0 0 1-3 3H24a3 3 0 0 1-3-3z" fill="#1490df" />
        <path
          d="M21 30l14.5 9L50 30"
          fill="none"
          stroke="#6fd3fa"
          strokeWidth="1.6"
        />
        {/* 앞: O 판 */}
        <rect
          x="9"
          y="19"
          width="22.5"
          height="22.5"
          rx="3.6"
          fill={`url(#${front})`}
        />
        <ellipse
          cx="20.25"
          cy="30.25"
          rx="5.3"
          ry="6.2"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
        />
      </Full>
    </Tile>
  );
};

export const GithubMark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden>
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);

export const GithubIcon = () => (
  <Tile bg="linear-gradient(180deg, #3a3a3d, #1f1f22)">
    <GithubMark className={s.mark} />
  </Tile>
);

/** 메뉴 막대 왼쪽과 부팅 화면에 쓰는 표식. 이름(홍제)의 첫 자음 ㅎ 을 본떴다. 파비콘도 같은 모양이다. */
export const LogoGlyph = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden>
    <g fill="currentColor">
      <rect x="6.2" y="0.8" width="3.6" height="2.2" rx="1.1" />
      <rect x="1.8" y="4.2" width="12.4" height="2.4" rx="1.2" />
    </g>
    <circle
      cx="8"
      cy="10.9"
      r="3.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    />
  </svg>
);

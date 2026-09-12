import s from './style.module.css';

// 수정: [아이콘 이미지] · src/assets/icons/<이름>.png 를 바꾸면 그대로 반영
const files = import.meta.glob<string>(
  '/src/assets/icons/*.{png,jpg,jpeg,svg,webp}',
  { query: '?url', import: 'default', eager: true },
);

const url = (name: string) =>
  Object.entries(files).find(([path]) => path.includes(`/${name}.`))?.[1];

const Image = ({ name, className }: { name: string; className?: string }) => (
  <img className={className ?? s.image} src={url(name)} alt="" />
);

// 추가: [독 아이콘] · 이름 = 파일 이름
export const NotesIcon = () => <Image name="notes" />;
export const FinderIcon = () => <Image name="finder" />;
export const LinkedInIcon = () => <Image name="linkedin" />;
export const InstagramIcon = () => <Image name="instagram" />;
export const OutlookIcon = () => <Image name="outlook" />;
export const GithubIcon = () => <Image name="github" />;

export const FolderGlyph = ({ className }: { className?: string }) => (
  <Image name="folder" className={className} />
);

export const DocGlyph = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 52 64"
    width="1em"
    height="1em"
    aria-hidden
  >
    <path
      d="M4.5 6a4 4 0 0 1 4-4H32l15.5 15.5V58a4 4 0 0 1-4 4h-35a4 4 0 0 1-4-4z"
      fill="#fff"
      stroke="#c8ccd4"
      strokeWidth="1.4"
    />
    <path d="M32 2 47.5 17.5H36a4 4 0 0 1-4-4z" fill="#dfe3ea" />
    <g stroke="#c3c8d1" strokeWidth="2.2" strokeLinecap="round">
      <path d="M13 30h26M13 39h26M13 48h17" />
    </g>
  </svg>
);

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

import { cx } from '@/utils/cx';
import s from './style.module.css';

/** 글 본문. 메모 · 프로젝트가 같은 글꼴 · 표 · 태그 모양으로 보여 준다. 좁은 화면이면 여백을 줄인다. */
const Markdown = ({
  html,
  narrow = false,
}: {
  html: string;
  narrow?: boolean;
}) => (
  <article
    className={cx(s.markdown, narrow && s.narrow)}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default Markdown;

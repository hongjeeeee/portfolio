import { cx } from '@/utils/cx';
import s from './style.module.css';

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

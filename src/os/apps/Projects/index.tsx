import { useState } from 'react';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import Glyph from '../../glyphs';
import { FolderGlyph } from '../../icons';
import Markdown from '../../Markdown';
import { notesIn } from '../../notes';
import s from './style.module.css';

// 수정: 프로젝트 글은 src/content/projects/*.md 에 넣는다. 파일 하나가 폴더 하나다.
const Projects = () => {
  const projectId = useOS((st) => st.projectId);
  const { setProjectId } = useOS.getState();
  const compact = useOS((st) => st.layout.mode === 'compact');

  const [ahead, setAhead] = useState<string | null>(null);

  const list = notesIn('projects');
  const current = list.find((p) => p.id === projectId) ?? null;

  const enter = (id: string) => {
    setAhead(null);
    setProjectId(id);
  };
  const back = () => {
    setAhead(current?.id ?? null);
    setProjectId(null);
  };

  return (
    <div className={cx(s.finder, compact && s.compact)}>
      <header className={s.toolbar}>
        <div className={s.nav}>
          <button
            type="button"
            onClick={back}
            disabled={!current}
            aria-label="뒤로"
          >
            <Glyph name="back" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => ahead && enter(ahead)}
            disabled={!!current || !ahead}
            aria-label="앞으로"
          >
            <Glyph name="forward" strokeWidth={2.2} />
          </button>
        </div>
        <strong className={s.path}>{current?.title ?? '프로젝트'}</strong>
        {current?.link && (
          <a
            className={s.visit}
            href={current.link}
            target="_blank"
            rel="noreferrer"
          >
            <Glyph name="external" /> 링크 열기
          </a>
        )}
      </header>

      {current ? (
        <div className={s.page}>
          <Markdown html={current.html} narrow={compact} />
        </div>
      ) : (
        <>
          <div className={s.grid}>
            {list.length === 0 && <p className={s.empty}>항목 없음</p>}
            {list.map((p) => (
              <button
                key={p.id}
                type="button"
                className={s.item}
                onClick={() => enter(p.id)}
                title={p.excerpt || p.title}
              >
                <FolderGlyph className={s.folder} />
                <span className={s.name}>{p.title}</span>
              </button>
            ))}
          </div>
          <footer className={s.status}>{list.length}개 항목</footer>
        </>
      )}
    </div>
  );
};

export default Projects;

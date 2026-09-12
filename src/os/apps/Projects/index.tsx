import { useState } from 'react';
import { FINDER_ROOT, finderFolders } from '@/config/notes';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import Glyph from '../../glyphs';
import { DocGlyph, FolderGlyph } from '../../icons';
import Markdown from '../../Markdown';
import { notes, notesIn } from '../../notes';
import s from './style.module.css';

// 글 위치: src/content/<폴더>/*.md · 폴더 목록: src/config/notes.ts
const Finder = () => {
  const path = useOS((st) => st.projectId);
  const { setProjectId } = useOS.getState();
  const compact = useOS((st) => st.layout.mode === 'compact');

  const [ahead, setAhead] = useState<string | null>(null);

  const doc = notes.find((n) => n.id === path) ?? null;
  const folder = finderFolders.find(
    (f) => f.id === (doc ? doc.category : path),
  );

  const entries = doc
    ? []
    : folder
      ? notesIn(folder.id).map((n) => ({
          key: n.id,
          name: n.title,
          hint: n.excerpt || n.title,
          doc: true,
        }))
      : finderFolders.map((f) => ({
          key: f.id,
          name: f.title,
          hint: `${notesIn(f.id).length}개 항목`,
          doc: false,
        }));

  const go = (id: string | null) => {
    setAhead(null);
    setProjectId(id);
  };
  const back = () => {
    setAhead(path);
    setProjectId(doc ? doc.category : null);
  };

  return (
    <div className={cx(s.finder, compact && s.compact)}>
      <header className={s.toolbar}>
        <div className={s.nav}>
          <button
            type="button"
            onClick={back}
            disabled={!folder}
            aria-label="뒤로"
          >
            <Glyph name="back" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => ahead && go(ahead)}
            disabled={!ahead}
            aria-label="앞으로"
          >
            <Glyph name="forward" strokeWidth={2.2} />
          </button>
        </div>
        <strong className={s.path}>
          {[FINDER_ROOT, folder?.title, doc?.title].filter(Boolean).join(' › ')}
        </strong>
        {doc?.link && (
          <a
            className={s.visit}
            href={doc.link}
            target="_blank"
            rel="noreferrer"
          >
            <Glyph name="external" /> 링크 열기
          </a>
        )}
      </header>

      {doc ? (
        <div className={s.page}>
          <Markdown html={doc.html} narrow={compact} />
        </div>
      ) : (
        <>
          <div className={s.grid}>
            {entries.length === 0 && <p className={s.empty}>항목 없음</p>}
            {entries.map((e) => (
              <button
                key={e.key}
                type="button"
                className={s.item}
                onClick={() => go(e.key)}
                title={e.hint}
              >
                {e.doc ? (
                  <DocGlyph className={s.icon} />
                ) : (
                  <FolderGlyph className={s.icon} />
                )}
                <span className={s.name}>{e.name}</span>
              </button>
            ))}
          </div>
          <footer className={s.status}>{entries.length}개 항목</footer>
        </>
      )}
    </div>
  );
};

export default Finder;

import { noteCategories } from '@/config/notes';
import { useElementWidth } from '@/hooks/useElementWidth';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import Glyph from '../../glyphs';
import Markdown from '../../Markdown';
import { notes, notesIn } from '../../notes';
import s from './style.module.css';

/**
 * 애플 메모처럼 목록 · 본문 두 칸. 목록은 분류마다 제목을 달고 그 아래에 글을 모은다.
 * 글은 src/content/<분류>/*.md 에서 온다. 창이 좁으면(폰, 작은 창) 목록과 본문을 한 화면씩 넘겨 본다.
 */
const Notes = () => {
  const noteId = useOS((st) => st.noteId);
  const { setNoteId } = useOS.getState();
  const compact = useOS((st) => st.layout.mode === 'compact');
  const [ref, width] = useElementWidth<HTMLDivElement>();
  // 폰에서는 폭을 재기 전에도 좁은 배치로 시작한다.
  const narrow = compact || (width > 0 && width < 600);

  // 글이 없는 분류는 제목도 감춘다.
  const sections = noteCategories
    .map((c) => ({ ...c, list: notesIn(c.id) }))
    .filter((c) => c.list.length > 0);
  const picked = notes.find((n) => n.id === noteId) ?? null;
  // 넓을 때는 아무것도 안 골랐어도 맨 위 글을 보여 준다.
  const current = picked ?? (narrow ? null : (sections[0]?.list[0] ?? null));

  const listView = (
    <div className={s.list}>
      {sections.length === 0 ? (
        <p className={s.empty}>메모 없음</p>
      ) : (
        sections.map((c) => (
          <section key={c.id}>
            <h3 className={s.heading}>{c.title}</h3>
            <ul className={s.items}>
              {c.list.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cx(s.note, current?.id === n.id && s.noteOn)}
                    onClick={() => setNoteId(n.id)}
                  >
                    <span className={s.noteTitle}>
                      <span>{n.title}</span>
                      {n.link && <Glyph name="link" className={s.linkIcon} />}
                    </span>
                    {n.excerpt && (
                      <span className={s.excerpt}>{n.excerpt}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );

  const content = (
    <div className={s.content}>
      {narrow && (
        <button
          type="button"
          className={s.back}
          onClick={() => setNoteId(null)}
        >
          ‹ 목록
        </button>
      )}
      {current ? (
        <>
          {current.link && (
            <a
              className={s.visit}
              href={current.link}
              target="_blank"
              rel="noreferrer"
            >
              <Glyph name="external" /> 링크 열기
            </a>
          )}
          <Markdown html={current.html} narrow={narrow} />
        </>
      ) : (
        <p className={s.empty}>메모 없음</p>
      )}
    </div>
  );

  return (
    <div ref={ref} className={cx(s.notes, narrow && s.narrow)}>
      {narrow ? (
        picked ? (
          content
        ) : (
          listView
        )
      ) : (
        <>
          {listView}
          {content}
        </>
      )}
    </div>
  );
};

export default Notes;

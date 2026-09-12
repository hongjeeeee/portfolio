import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import Glyph from '../glyphs';
import { searchItems, type SearchItem } from '../search';
import s from './style.module.css';

const Panel = () => {
  const setSpotlight = useOS((st) => st.setSpotlight);
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = searchItems(query);
  const activate = (r: SearchItem) => {
    r.run();
    setSpotlight(false);
  };

  useEffect(() => input.current?.focus({ preventScroll: true }), []);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Escape') setSpotlight(false);
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[sel]) activate(results[sel]);
  };

  return (
    <>
      <div className={s.scrim} onPointerDown={() => setSpotlight(false)} />
      <div className={s.panel} role="dialog" aria-label="Spotlight">
        <label className={s.field}>
          <Glyph name="search" className={s.searchIcon} strokeWidth={2} />
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Spotlight 검색"
            spellCheck={false}
          />
        </label>
        {query.trim() && (
          <div className={s.results}>
            {results.length === 0 && <p className={s.none}>결과 없음</p>}
            {results.map((r, i) => (
              <div key={r.key}>
                {r.group !== results[i - 1]?.group && (
                  <p className={s.group}>{r.group}</p>
                )}
                <button
                  type="button"
                  className={cx(s.result, i === sel && s.selected)}
                  onPointerEnter={() => setSel(i)}
                  onClick={() => activate(r)}
                >
                  <span className={s.resultIcon}>{r.icon}</span>
                  <span className={s.resultTitle}>{r.title}</span>
                  {r.sub && <span className={s.resultSub}>{r.sub}</span>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const Spotlight = () => {
  const open = useOS((st) => st.spotlight);
  return open ? <Panel /> : null;
};

export default Spotlight;

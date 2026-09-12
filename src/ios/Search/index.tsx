import { useEffect, useRef, useState } from 'react';
import Glyph from '@/os/glyphs';
import { searchItems } from '@/os/search';
import s from './style.module.css';

interface Props {
  onPick: () => void;
  onClose: () => void;
}

const Search = ({ onPick, onClose }: Props) => {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const results = searchItems(query);

  useEffect(() => input.current?.focus({ preventScroll: true }), []);

  return (
    <div className={s.search} onClick={onClose}>
      <div className={s.top} onClick={(e) => e.stopPropagation()}>
        <label className={s.field}>
          <Glyph name="search" className={s.fieldIcon} strokeWidth={2.2} />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색"
            enterKeyHint="search"
            spellCheck={false}
          />
        </label>
        <button type="button" className={s.cancel} onClick={onClose}>
          취소
        </button>
      </div>

      {query.trim() && (
        <div className={s.results} onClick={(e) => e.stopPropagation()}>
          {results.length === 0 && <p className={s.none}>결과 없음</p>}
          {results.map((r, i) => (
            <div key={r.key}>
              {r.group !== results[i - 1]?.group && (
                <p className={s.group}>{r.group}</p>
              )}
              <button
                type="button"
                className={s.result}
                onClick={() => {
                  onPick();
                  r.run();
                  onClose();
                }}
              >
                <span className={s.resultIcon}>{r.icon}</span>
                <span className={s.text}>
                  <strong>{r.title}</strong>
                  {r.sub && <small>{r.sub}</small>}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

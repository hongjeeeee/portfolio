import { useEffect, useRef, useState } from 'react';
import Glyph from '@/os/glyphs';
import { searchItems } from '@/os/search';
import s from './style.module.css';

interface Props {
  /** 결과를 누르기 직전. 홈 화면이 아이콘 자리 대신 가운데에서 앱을 열게 한다. */
  onPick: () => void;
  onClose: () => void;
}

/** 홈 화면의 '검색' 알약을 누르면 뜬다. 찾는 대상은 맥의 Spotlight 와 같다. */
const Search = ({ onPick, onClose }: Props) => {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const results = searchItems(query);

  // preventScroll 이 없으면 브라우저가 입력칸을 보이게 하려고 화면 전체를 민다.
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

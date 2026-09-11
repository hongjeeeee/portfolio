import { useEffect, useState } from 'react';

/** 메뉴 막대 시계용. 분 단위만 보여 주니 10초마다면 충분하다. */
export const useNow = (ms = 10_000) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
};

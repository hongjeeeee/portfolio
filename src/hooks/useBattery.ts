import { useEffect, useState } from 'react';

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

/** 크롬 계열만 배터리 API 가 있다. 없으면 가득 찬 걸로 보여 준다. */
export const useBattery = () => {
  const [state, setState] = useState({ level: 1, charging: false });

  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManager>;
    };
    if (!nav.getBattery) return;
    let battery: BatteryManager | null = null;
    const update = () =>
      battery && setState({ level: battery.level, charging: battery.charging });
    nav.getBattery().then((b) => {
      battery = b;
      update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
    });
    return () => {
      battery?.removeEventListener('levelchange', update);
      battery?.removeEventListener('chargingchange', update);
    };
  }, []);

  return state;
};

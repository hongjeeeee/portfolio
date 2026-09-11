/** 조건부 className 을 공백으로 잇는다. */
export const cx = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

export type Option<T> = { value: T; some: true } | { value: null; some: false };

export const Option = {
  fromUndef: <T>(value: T | undefined): Option<T> => {
    if (value === undefined) return None;
    return Some(value);
  },
};

export const None = { value: null, some: false } satisfies Option<never>;

export function Some<T>(value: T): Option<T> {
  return { value, some: true };
}

export function getFirstOption<T>(options: Array<Option<T>>): Option<T> {
  for (const option of options) {
    if (option.some) return option;
  }
  return None;
}

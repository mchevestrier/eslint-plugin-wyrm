/* eslint-disable @typescript-eslint/no-non-null-assertion */

declare const arr: string[];

export function noFirstLast() {
  // eslint-disable-next-line wyrm/no-first-last
  const lastFirst = arr.at(0);

  let firstLast = 'ok';
  if (Math.cos(0)) {
    // eslint-disable-next-line wyrm/no-first-last
    firstLast = arr.at(-1)!;
  }

  return {
    firstLast,
    lastFirst,
    // eslint-disable-next-line wyrm/no-first-last
    lastFoo: arr[0],
  };
}

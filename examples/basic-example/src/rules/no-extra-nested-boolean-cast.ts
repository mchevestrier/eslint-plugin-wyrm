declare const foo: string;
declare const bar: string;

if (
  // eslint-disable-next-line wyrm/no-extra-nested-boolean-cast
  !!foo &&
  // eslint-disable-next-line wyrm/no-extra-nested-boolean-cast
  !!bar
) {
  console.log('foobar!');
}

const arr = [1, 2, 3];
export const filtered = arr.filter(
  (n) =>
    // eslint-disable-next-line wyrm/no-extra-nested-boolean-cast
    !!n,
);

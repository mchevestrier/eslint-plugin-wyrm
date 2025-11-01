declare const foo: string;
declare const bar: string;

if (!!foo && !!bar) {
  console.log('foobar!');
}

const arr = [1, 2, 3];
export const filtered = arr.filter((n) => !!n);

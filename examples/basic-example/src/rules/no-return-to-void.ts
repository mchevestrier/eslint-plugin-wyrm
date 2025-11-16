/* eslint-disable unicorn/no-array-for-each */

[1, 2, 3].forEach((it) => {
  console.log(it);
  // eslint-disable-next-line wyrm/no-return-to-void
  return 42;
});

function foo(fn: () => void) {
  fn();
}
foo(() => {
  // eslint-disable-next-line wyrm/no-return-to-void
  return 42;
});

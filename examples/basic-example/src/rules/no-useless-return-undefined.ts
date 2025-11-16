function foo(fn: (() => void) | (() => string)) {
  fn();
}

foo(() => {
  // eslint-disable-next-line wyrm/no-useless-return-undefined
  return undefined;
});

foo(() => {
  if (Math.sin(0)) return;
  // eslint-disable-next-line wyrm/no-useless-return-undefined
  return undefined;
});

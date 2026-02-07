// eslint-disable-next-line wyrm/no-unused-mutually-referential
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

// eslint-disable-next-line wyrm/no-unused-mutually-referential
function bar(n: number): number {
  if (n === 0) return 1;
  return baz(n - 1) + 1;
}

// eslint-disable-next-line wyrm/no-unused-mutually-referential
function baz(n: number): number {
  if (n === 0) return 42;
  return foo(n - 1);
}

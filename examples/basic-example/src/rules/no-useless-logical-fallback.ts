export function noUselessNullishFallback(foo: string | undefined) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  return foo ?? undefined;
}

export function noUselessNullishFallback2(foo: string | null) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  return foo ?? null;
}

export function noUselessNullishFallback3(foo: string | undefined) {
  // Ok
  return foo ?? null;
}

export function noUselessNullishFallback4(foo: string | null) {
  // Ok
  return foo ?? undefined;
}

export function noUselessNullishFallback5(foo: boolean) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  const a = foo || false;
  // eslint-disable-next-line wyrm/no-useless-logical-fallback, sonarjs/no-redundant-boolean
  const b = foo && true;
  return a && b;
}

export function noUselessNullishFallback6(foo: boolean) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback, sonarjs/no-redundant-boolean
  const a = foo && false;
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  const b = foo || true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return a || b;
}

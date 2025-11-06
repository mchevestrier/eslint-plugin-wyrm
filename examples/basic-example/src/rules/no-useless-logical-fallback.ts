/* eslint-disable unicorn/prefer-default-parameters */

export function nouselessLogicalFallback(foo: string | undefined) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  return foo ?? undefined;
}

export function nouselessLogicalFallback2(foo: string | null) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  return foo ?? null;
}

export function nouselessLogicalFallback3(foo: string | undefined) {
  // Ok
  return foo ?? null;
}

export function nouselessLogicalFallback4(foo: string | null) {
  // Ok
  return foo ?? undefined;
}

export function nouselessLogicalFallback5(foo: boolean) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  const a = foo || false;
  // eslint-disable-next-line wyrm/no-useless-logical-fallback, sonarjs/no-redundant-boolean
  const b = foo && true;
  return a && b;
}

export function nouselessLogicalFallback6(foo: boolean) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback, sonarjs/no-redundant-boolean
  const a = foo && false;
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  const b = foo || true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return a || b;
}

export function nouselessLogicalFallback7(
  foo: string,
  bar: string | undefined,
  baz?: string,
) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  const x = foo || '';
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const y = bar || '';
  const z = baz ?? '';

  return { x, y, z };
}

export function nouselessLogicalFallback8(
  foo: number,
  bar: number | undefined,
  baz?: number,
) {
  // eslint-disable-next-line wyrm/no-useless-logical-fallback
  const x = foo || 0;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const y = bar || 0;
  const z = baz ?? 0;

  const a = Number.isNaN(z) ? 0 : z;

  return { x, y, z, a };
}

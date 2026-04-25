/* eslint-disable wyrm/no-convoluted-logical-expressions, wyrm/no-extra-false-fallback */

export function constantBooleanCast1(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return (quux ? foo : null) ?? (!quux ? bar : null);
}

export function constantBooleanCast2(arr: Array<string | null>) {
  return arr.some((item) => item ?? false);
}

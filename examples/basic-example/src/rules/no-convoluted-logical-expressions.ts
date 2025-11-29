/* eslint-disable wyrm/no-ternary-return */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, unicorn/no-nested-ternary */
/* eslint-disable sonarjs/no-selector-parameter, sonarjs/no-nested-conditional, sonarjs/function-return-type */

export function noConvolutedLogicalExpression1(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) ?? (!quux ? bar : null);
}

export function noConvolutedLogicalExpression1Fixed(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return quux ? (foo ?? null) : bar;
}

export function noConvolutedLogicalExpression2(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) && (!quux ? bar : null);
}

export function noConvolutedLogicalExpression2Fixed(
  quux: boolean,
  foo: number | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _bar: number | undefined,
) {
  return quux ? foo && null : null;
}

export function noConvolutedLogicalExpression3(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) || (!quux ? bar : null);
}

export function noConvolutedLogicalExpression3Fixed(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return quux ? foo || null : bar;
}

export function noConvolutedLogicalExpression4(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) || (quux ? bar : null);
}

export function noConvolutedLogicalExpression4Fixed(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return quux ? foo || bar : null;
}

export function noConvolutedLogicalExpression5(
  quux: boolean,
  fnord: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) || (fnord ? bar : null);
}

export function noConvolutedLogicalExpression5Fixed(
  quux: boolean,
  fnord: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return quux && foo ? foo : fnord ? bar : null;
}

export function noConvolutedLogicalExpression6(
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return foo || (foo && bar);
}

export function noConvolutedLogicalExpression6Fixed(
  foo: number | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _bar: number | undefined,
) {
  return foo;
}

export function noConvolutedLogicalExpression7(
  foo: number | undefined,
  bar: number | undefined,
  baz: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (foo && bar) || (foo && baz);
}

export function noConvolutedLogicalExpression7Fixed(
  foo: number | undefined,
  bar: number | undefined,
  baz: number | undefined,
) {
  return foo && (bar || baz);
}

export function noConvolutedLogicalExpression8(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) && (quux ? bar : null);
}

export function noConvolutedLogicalExpression8Fixed(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return quux ? foo && bar : null;
}

export function noConvolutedLogicalExpression9(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return (quux ? foo : null) ?? (quux ? bar : null);
}

export function noConvolutedLogicalExpression9Fixed(
  quux: boolean,
  foo: number | undefined,
  bar: number | undefined,
) {
  return quux ? (foo ?? bar) : null;
}

export function noConvolutedLogicalExpression10(foo: number | undefined) {
  // eslint-disable-next-line wyrm/no-convoluted-logical-expressions
  return foo ?? foo;
}

export function noConvolutedLogicalExpression10Fixed(foo: number | undefined) {
  return foo;
}

// Not simplifiable:

export function notConvolutedLogicalExpression1(
  quux: number | undefined,
  foo: number | undefined,
  bar: number | undefined,
) {
  return (quux ? foo : false) ?? (!quux ? bar : false);
}

export function notConvolutedLogicalExpression2(
  quux: number | undefined,
  foo: number | undefined,
  bar: number | undefined,
  baz: number | undefined,
) {
  return (quux ? foo : baz) ?? (!quux ? bar : baz);
}

export function notConvolutedLogicalExpression3(
  quux: number | undefined,
  foo: number | undefined,
  bar: number | undefined,
  baz: number | undefined,
  fnord: number | undefined,
) {
  return (quux ? foo : baz) ?? (!quux ? bar : fnord);
}

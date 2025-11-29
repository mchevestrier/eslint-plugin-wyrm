import { describe, expect, test } from 'vitest';
import fc from 'fast-check';

import {
  noConvolutedLogicalExpression1,
  noConvolutedLogicalExpression1Fixed,
  noConvolutedLogicalExpression2,
  noConvolutedLogicalExpression2Fixed,
  noConvolutedLogicalExpression3,
  noConvolutedLogicalExpression3Fixed,
  noConvolutedLogicalExpression4,
  noConvolutedLogicalExpression4Fixed,
  noConvolutedLogicalExpression5,
  noConvolutedLogicalExpression5Fixed,
  noConvolutedLogicalExpression6,
  noConvolutedLogicalExpression6Fixed,
  noConvolutedLogicalExpression7,
  noConvolutedLogicalExpression7Fixed,
  noConvolutedLogicalExpression8,
  noConvolutedLogicalExpression8Fixed,
  noConvolutedLogicalExpression9,
  noConvolutedLogicalExpression9Fixed,
  noConvolutedLogicalExpression10,
  noConvolutedLogicalExpression10Fixed,
  noConvolutedLogicalExpression11,
  noConvolutedLogicalExpression11Fixed,
  noConvolutedLogicalExpression12,
  noConvolutedLogicalExpression12Fixed,
  noConvolutedLogicalExpression13,
  noConvolutedLogicalExpression13Fixed,
  noConvolutedLogicalExpression14,
  noConvolutedLogicalExpression14Fixed,
  noConvolutedLogicalExpression15,
  noConvolutedLogicalExpression15Fixed,
  noConvolutedLogicalExpression16,
  noConvolutedLogicalExpression16Fixed,
  noConvolutedLogicalExpression17,
  noConvolutedLogicalExpression17Fixed,
  noConvolutedLogicalExpression18,
  noConvolutedLogicalExpression18Fixed,
} from './no-convoluted-logical-expressions.js';

describe('no-convoluted-logical-expressions', () => {
  test('fixing the logical expression should not change results for noConvolutedLogicalExpression1()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (quux, foo, bar) => {
          const unfixedResult = noConvolutedLogicalExpression1(quux, foo, bar);
          const fixedResult = noConvolutedLogicalExpression1Fixed(quux, foo, bar);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression2()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (quux, foo, bar) => {
          const unfixedResult = noConvolutedLogicalExpression2(quux, foo, bar);
          const fixedResult = noConvolutedLogicalExpression2Fixed(quux, foo, bar);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression3()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (quux, foo, bar) => {
          const unfixedResult = noConvolutedLogicalExpression3(quux, foo, bar);
          const fixedResult = noConvolutedLogicalExpression3Fixed(quux, foo, bar);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression4()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (quux, foo, bar) => {
          const unfixedResult = noConvolutedLogicalExpression4(quux, foo, bar);
          const fixedResult = noConvolutedLogicalExpression4Fixed(quux, foo, bar);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression5()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (quux, fnord, foo, bar) => {
          const unfixedResult = noConvolutedLogicalExpression5(quux, fnord, foo, bar);
          const fixedResult = noConvolutedLogicalExpression5Fixed(quux, fnord, foo, bar);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression6()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar) => {
          const unfixedResult = noConvolutedLogicalExpression6(foo, bar);
          const fixedResult = noConvolutedLogicalExpression6Fixed(foo, bar);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression7()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression7(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression7Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression8()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression8(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression8Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression9()', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression9(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression9Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression10()', () => {
    fc.assert(
      fc.property(fc.option(fc.float(), { nil: undefined }), (foo) => {
        const unfixedResult = noConvolutedLogicalExpression10(foo);
        const fixedResult = noConvolutedLogicalExpression10Fixed(foo);
        expect(fixedResult).toBe(unfixedResult);
      }),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression11()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression11(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression11Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression12()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression12(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression12Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression13()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression13(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression13Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression14()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression14(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression14Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression15()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression15(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression15Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression16()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression16(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression16Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression17()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression17(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression17Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });

  test('fixing the logical expression should not change results for noConvolutedLogicalExpression18()', () => {
    fc.assert(
      fc.property(
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        fc.option(fc.float(), { nil: undefined }),
        (foo, bar, baz) => {
          const unfixedResult = noConvolutedLogicalExpression18(foo, bar, baz);
          const fixedResult = noConvolutedLogicalExpression18Fixed(foo, bar, baz);
          expect(fixedResult).toBe(unfixedResult);
        },
      ),
    );
  });
});

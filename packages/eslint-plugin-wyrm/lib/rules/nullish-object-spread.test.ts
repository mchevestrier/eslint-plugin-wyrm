import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './nullish-object-spread.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No useless fallback #docs',
      code: `
const foo = null;
const obj = { ...foo };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'In array spread',
      code: `
const foo = null;
const obj = [...(foo ?? {})];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Regular property (not spread)',
      code: `
const foo = null;
const obj = { foo: foo ?? {} };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread with non-logical expression',
      code: `
const foo = undefined;
const obj = { ...foo() };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread with OR operator instead of nullish coalescing',
      code: `
const foo = null;
const obj = { ...(foo || {}) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread with AND operator',
      code: `
const foo = null;
const obj = { ...(foo && {}) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with non-object expression on right',
      code: `
const foo = null;
const obj = { ...(foo ?? bar) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with non-empty object fallback',
      code: `
const foo = null;
const obj = { ...(foo ?? { bar: 'baz' }) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with string literal fallback (strings are iterable)',
      code: `
const foo = null;
const obj = { ...(foo ?? 'string') };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with template literal fallback',
      code: `
const foo = null;
const obj = { ...(foo ?? \`template\`) };
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Useless fallback with empty object #docs',
      code: `
const foo = null;
const obj = { ...(foo ?? {}) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with undefined',
      code: `
const foo = null;
const obj = { ...(foo ?? undefined) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with null literal',
      code: `
const foo = undefined;
const obj = { ...(foo ?? null) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with number literal',
      code: `
const foo = null;
const obj = { ...(foo ?? 42) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with zero',
      code: `
const foo = null;
const obj = { ...(foo ?? 0) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with boolean true',
      code: `
const foo = null;
const obj = { ...(foo ?? true) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with boolean false',
      code: `
const foo = null;
const obj = { ...(foo ?? false) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple spreads with useless fallback',
      code: `
const foo = null;
const bar = undefined;
const obj = { a: 1, ...(foo ?? {}), b: 2, ...(bar ?? {}) };
`,
      errors: [{ messageId: 'uselessFallback' }, { messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Mixed valid and invalid spreads',
      code: `
const foo = null;
const bar = undefined;
const obj = { ...(foo ?? {}), ...(bar ?? { key: 'value' }) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with BigInt literal',
      code: `
const foo = null;
const obj = { ...(foo ?? 42n) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless fallback with regex literal',
      code: `
const foo = null;
const obj = { ...(foo ?? /regex/) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

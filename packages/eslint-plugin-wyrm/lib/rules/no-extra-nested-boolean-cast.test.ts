import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-extra-nested-boolean-cast.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No extra boolean cast (included in docs)',
      code: `declare const foo: string;
declare const bar: string;
declare const baz: string;

if (bar && (foo || baz)) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Short-circuiting expression (included in docs)',
      code: `declare const foo: string;
declare const bar: string;
declare const baz: string;

const val = !!bar && (!!foo || !!baz);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Double negation in array method predicate, but not in return position',
      code: `declare const arr: string[];
const isOkay = arr.filter((elt) => {
  const foo = barbaz(!!elt);
  return 'ok';
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method call takes no predicate',
      code: `declare const arr: string[];
const bits = arr.map((elt) => !!elt);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method predicate with no extra boolean cast',
      code: `declare const arr: string[];
const bits = arr.map((elt) => elt);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Redundant double negation (included in docs)',
      code: `declare const foo: string;

if (!!bar) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCast',
          line: 3,
          endLine: 3,
          column: 5,
          endColumn: 10,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate (included in docs)',
      code: `declare const arr: string[];
const isOkay = arr.filter((elt) => !!elt);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 2,
          endLine: 2,
          column: 36,
          endColumn: 41,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate, with optional chaining',
      code: `declare const arr: string[] | undefined;
const isOkay = arr?.filter((elt) => !!elt);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 2,
          endLine: 2,
          column: 37,
          endColumn: 42,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate with body',
      code: `declare const arr: string[];
const isOkay = arr.filter((elt) => {
  return !!elt;
});
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 3,
          endLine: 3,
          column: 10,
          endColumn: 15,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate with conditional return',
      code: `declare const arr: string[];
const isOkay = arr.filter((elt) => {
  if (1) return !!elt;
  return 'ok';
});
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 3,
          endLine: 3,
          column: 17,
          endColumn: 22,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negations in logical sub-expressions (included in docs)',
      code: `declare const foo: string;
declare const bar: string;
declare const baz: string;

if (!!bar && (!!foo || !!baz)) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 5,
          endColumn: 10,
        },
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 15,
          endColumn: 20,
        },
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 24,
          endColumn: 29,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant Boolean calls (included in docs)',
      code: `declare const foo: string;
declare const bar: string;
declare const baz: string;

if (Boolean(bar) && (Boolean(foo) || Boolean(baz))) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 5,
          endColumn: 17,
        },
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 22,
          endColumn: 34,
        },
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 38,
          endColumn: 50,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negations nested in type assertions (included in docs)',
      code: `declare const foo: string;
declare const bar: string;
declare const baz: string;

if ((!!bar)! && ((!!foo satisfies boolean) || (!!baz as any))) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 6,
          endColumn: 11,
        },
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 19,
          endColumn: 24,
        },
        {
          messageId: 'noExtraBooleanCast',
          line: 5,
          endLine: 5,
          column: 48,
          endColumn: 53,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

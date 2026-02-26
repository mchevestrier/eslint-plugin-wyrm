import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-extra-nested-boolean-cast.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No extra boolean cast #docs',
      code: `
declare const foo: string;
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
      name: 'Short-circuiting expression #docs',
      code: `
declare const foo: string;
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
      code: `
declare const arr: string[];
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
      name: 'Boolean cast is in conditional expression, but not in test position',
      code: `
declare const foo: string;

1 ? !!foo : 0;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method call takes no predicate',
      code: `
declare const arr: string[];
const bits = arr.map((elt) => !!elt);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method predicate with no extra boolean cast',
      code: `
declare const arr: string[];
const bits = arr.filter((elt) => elt);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Boolean call at the program root',
      code: `
declare const foo: string;
Boolean(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Boolean call in Block at the program root',
      code: `
declare const foo: string;
{
  return Boolean(foo);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: function is not passed to a call expression',
      code: `
const foo = (it) => Boolean(it);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: function is not the first argument to a call expression',
      code: `
[].filter(foo, (it) => Boolean(it));
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: function is not the argument of a member expression call',
      code: `
filter((it) => Boolean(it), foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: call expression method is not an identifier',
      code: `
[0, 1, 2]['filter']((it) => Boolean(it));
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a boolean cast: single negation',
      code: `
[].filter((it) => !it);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a boolean cast: single negation wrapped in other unary expression',
      code: `
[].filter((it) => +!it);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression in condition test, but callee is not an identifier',
      code: `
declare const bar: number;

if (Math.floor(bar)) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression in condition test, but not a Boolean call',
      code: `
declare const bar: string;

if (Error(bar)) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple negation',
      code: `
declare const foo: string;

if (!foo) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple negation wrapped in other unary expression',
      code: `
declare const foo: string;

if (+!foo) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Other unary expression wrapped in simple negation',
      code: `
declare const foo: string;

if (!+foo) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callback with type predicate in return type',
      code: `
declare const arr: string[];
const isOkay = arr.filter((elt): elt is 'ok' => {
  return !!elt;
});
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Redundant double negation #docs',
      code: `
declare const foo: string;

if (!!foo) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 4,
          endLine: 4,
          column: 5,
          endColumn: 10,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in `while` test',
      code: `
declare const foo: string;

while (!!foo) {
  console.log('foo!');
}
`,
      errors: [{ messageId: 'noExtraBooleanCastInCondition' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in `do while` test',
      code: `
declare const foo: string;

do {
  console.log('foo!');
} while (!!foo);
`,
      errors: [{ messageId: 'noExtraBooleanCastInCondition' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation inside of another boolean cast #docs',
      code: `
const x = Boolean(!!foo);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInsideAnother',
          line: 2,
          endLine: 2,
          column: 19,
          endColumn: 24,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation within a logical expression inside of another boolean cast',
      code: `
const x = Boolean(!!foo && foo.length > 0);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInsideAnother',
          line: 2,
          endLine: 2,
          column: 19,
          endColumn: 24,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation inside of another double negation',
      code: `
const x = !!(!!foo && foo.length > 0);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInsideAnother',
          line: 2,
          endLine: 2,
          column: 14,
          endColumn: 19,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate #docs',
      code: `
declare const arr: string[];
const isOkay = arr.filter((elt) => !!elt);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 3,
          endLine: 3,
          column: 36,
          endColumn: 41,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant Boolean call in return of array method predicate',
      code: `
declare const arr: string[];
const isOkay = arr.filter((elt) => Boolean(elt));
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 3,
          endLine: 3,
          column: 36,
          endColumn: 48,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate, with optional chaining',
      code: `
declare const arr: string[] | undefined;
const isOkay = arr?.filter((elt) => !!elt);
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 3,
          endLine: 3,
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
      code: `
declare const arr: string[];
const isOkay = arr.filter((elt) => {
  return !!elt;
});
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 4,
          endLine: 4,
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
      code: `
declare const arr: string[];
const isOkay = arr.filter((elt) => {
  if (1) return !!elt;
  return 'ok';
});
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInPredicate',
          line: 4,
          endLine: 4,
          column: 17,
          endColumn: 22,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negations in logical sub-expressions #docs',
      code: `
declare const foo: string;
declare const bar: string;
declare const baz: string;

if (!!bar && (!!foo || !!baz)) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 5,
          endColumn: 10,
        },
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 15,
          endColumn: 20,
        },
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 24,
          endColumn: 29,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant Boolean calls #docs',
      code: `
declare const foo: string;
declare const bar: string;
declare const baz: string;

if (Boolean(bar) && (Boolean(foo) || Boolean(baz))) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 5,
          endColumn: 17,
        },
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 22,
          endColumn: 34,
        },
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 38,
          endColumn: 50,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negations nested in type assertions #docs',
      code: `
declare const foo: string;
declare const bar: string;
declare const baz: string;

if ((!!bar)! && ((!!foo satisfies boolean) || (!!baz as any))) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 6,
          endColumn: 11,
        },
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 19,
          endColumn: 24,
        },
        {
          messageId: 'noExtraBooleanCastInCondition',
          line: 6,
          endLine: 6,
          column: 48,
          endColumn: 53,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of `every` method predicate',
      code: `
declare const arr: string[];
const foo = arr.every((elt) => !!elt);
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of `some` method predicate',
      code: `
declare const arr: string[];
const foo = arr.some((elt) => !!elt);
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of `find` method predicate',
      code: `
declare const arr: string[];
const foo = arr.find((elt) => !!elt);
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of `findIndex` method predicate',
      code: `
declare const arr: string[];
const foo = arr.findIndex((elt) => !!elt);
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of `findLast` method predicate',
      code: `
declare const arr: string[];
const foo = arr.findLast((elt) => !!elt);
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of `findLastIndex` method predicate',
      code: `
declare const arr: string[];
const foo = arr.findLastIndex((elt) => !!elt);
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation in return of array method predicate, with function expression',
      code: `
declare const arr: string[];
const foo = arr.findLastIndex(function (elt) {
  return !!elt;
});
`,
      errors: [{ messageId: 'noExtraBooleanCastInPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant double negation inside method predicate, but in test of conditional expression',
      code: `
declare const arr: string[];
const foo = arr.filter((elt) => (!!elt ? 1 : 0));
`,
      errors: [{ messageId: 'noExtraBooleanCastInCondition' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

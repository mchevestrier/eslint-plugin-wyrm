import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-extra-false-fallback.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No extra `false` fallback #docs',
      code: `
if (bar && foo) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Logical expression operator is `&&`',
      code: `
if (bar && false) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'False fallback is in conditional expression, but not in test position',
      code: `
1 ? foo || false : 0;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Double unary expression but not a boolean cast',
      code: `
!+(foo || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Constant condition: this is likely a mistake but not covered by this rule. See `no-constant-condition` or `@typescript-eslint/no-unnecessary-condition`.',
      code: `
if (foo || true) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `true` fallback value #docs',
      code: `
if (bar && (foo ?? true)) {
  console.log('foo!');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non boolean fallback value',
      code: `
if (bar && (foo ?? getDefaultFoo())) {
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
const val: boolean = bar && (foo ?? false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'False fallback in array method predicate, but not in return position',
      code: `
declare const arr: Array<string | undefined>;
const isOkay = arr.filter((elt) => {
  const foo = barbaz(elt ?? false);
  return 'ok';
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'False fallback in array method predicate, but not in arrow function body',
      code: `
declare const arr: Array<string | undefined>;
const isOkay = arr.filter((elt = foo ?? false) => elt);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method call takes no predicate',
      code: `
declare const arr: Array<string | undefined>;
const bits = arr.map((elt) => elt ?? fallback);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method predicate with no `false` fallback',
      code: `
declare const arr: Array<string | undefined>;
const bits = arr.filter((elt) => elt);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Fallback in Block at the program root',
      code: `
declare const foo: string;
{
  return foo || false;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: function is not passed to a call expression',
      code: `
const foo = (it) => it || false;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: function is not the first argument to a call expression',
      code: `
[].filter(foo, (it) => it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: function is not the argument of a member expression call',
      code: `
filter((it) => it || false, foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: call expression method is not an identifier',
      code: `
[0, 1, 2]['filter']((it) => it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a predicate: array method is not one of the boolean-returning methods',
      code: `
[].push((it) => it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a boolean cast: other unary expression',
      code: `
+(it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a boolean cast: single negation',
      code: `
!(it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a boolean cast: single negation wrapped in other unary expression',
      code: `
+!(it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a boolean cast: callee is not an identifier',
      code: `
(1 ? Boolean : Error)(it || false);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Redundant `false` fallback #docs',
      code: `
if (foo ?? false) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInCondition',
          data: { operator: '??' },
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              data: { operator: '??' },
              output: `
if (foo) {
  console.log('foo!');
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback (`||` expression)',
      code: `
if (foo || false) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInCondition',
          data: { operator: '||' },
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              data: { operator: '||' },
              output: `
if (foo) {
  console.log('foo!');
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback inside of a boolean cast #docs',
      code: `
const x = Boolean(foo ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInsideBooleanCast',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
const x = Boolean(foo);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback inside of a boolean cast (`||` expression)',
      code: `
const x = Boolean(foo || false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInsideBooleanCast',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
const x = Boolean(foo);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback within a logical expression inside of a boolean cast',
      code: `
const x = Boolean((foo ?? false) && foo.length > 0);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInsideBooleanCast',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
const x = Boolean((foo) && foo.length > 0);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback inside of a double negation',
      code: `
const x = !!((foo ?? false) && foo.length > 0);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInsideBooleanCast',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
const x = !!((foo) && foo.length > 0);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate #docs',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.filter((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.filter((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate, with optional chaining',
      code: `
declare const arr: (string | undefined)[] | undefined;
const isOkay = arr?.filter((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: (string | undefined)[] | undefined;
const isOkay = arr?.filter((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate with body',
      code: `
declare const arr: (string | null)[];
const isOkay = arr.filter((elt) => {
  return elt ?? false;
});
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: (string | null)[];
const isOkay = arr.filter((elt) => {
  return elt;
});
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate with conditional return',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.filter((elt) => {
  if (1) return elt ?? false;
  return 'ok';
});
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.filter((elt) => {
  if (1) return elt;
  return 'ok';
});
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in logical sub-expressions #docs (with `&&`)',
      code: `
if ((bar ?? false) && (foo ?? false)) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar) && (foo ?? false)) {
  console.log('foo!');
}
`,
            },
          ],
        },
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar ?? false) && (foo)) {
  console.log('foo!');
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in logical sub-expressions (with `||`)',
      code: `
if ((bar ?? false) || (foo ?? false)) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar) || (foo ?? false)) {
  console.log('foo!');
}
`,
            },
          ],
        },
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar ?? false) || (foo)) {
  console.log('foo!');
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback nested in type assertions',
      code: `
if ((bar ?? false)! && (((foo ?? false) satisfies boolean) || ((baz ?? false) as any))) {
  console.log('foo!');
}
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar)! && (((foo ?? false) satisfies boolean) || ((baz ?? false) as any))) {
  console.log('foo!');
}
`,
            },
          ],
        },
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar ?? false)! && (((foo) satisfies boolean) || ((baz ?? false) as any))) {
  console.log('foo!');
}
`,
            },
          ],
        },
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
if ((bar ?? false)! && (((foo ?? false) satisfies boolean) || ((baz) as any))) {
  console.log('foo!');
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate (`every`)',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.every((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.every((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate (`some`)',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.some((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.some((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate (`find`)',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.find((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.find((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate (`findIndex`)',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.findIndex((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.findIndex((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate (`findLast`)',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.findLast((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.findLast((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate (`findLastIndex`)',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.findLastIndex((elt) => elt ?? false);
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.findLastIndex((elt) => elt);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant `false` fallback in return of array method predicate, with a function expression',
      code: `
declare const arr: Array<string | null>;
const isOkay = arr.some(function (elt) {
  return elt ?? false;
});
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInPredicate',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | null>;
const isOkay = arr.some(function (elt) {
  return elt;
});
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'False fallback inside array method predicate, but in test of ternary condition',
      code: `
declare const arr: Array<string | undefined>;
const isOkay = arr.filter((elt) => ((foo ?? false) ? elt : 0));
`,
      errors: [
        {
          messageId: 'noExtraFalseFallbackInCondition',
          suggestions: [
            {
              messageId: 'removeFalseFallback',
              output: `
declare const arr: Array<string | undefined>;
const isOkay = arr.filter((elt) => ((foo) ? elt : 0));
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

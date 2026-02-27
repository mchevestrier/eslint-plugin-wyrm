import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './constant-boolean-cast.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      project: './tsconfig.json',
      projectService: false,
      tsconfigRootDir: path.join(import.meta.dirname, './fixtures'),
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Variable boolean cast #docs',
      code: `
function isNotEmpty(str: string): boolean {
  return !!str;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `number`',
      code: `
function fun(foo: number): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `boolean`',
      code: `
function fun(foo: boolean): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `any`',
      code: `
function fun(foo: any): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `unknown`',
      code: `
function fun(foo: unknown): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `never`',
      code: `
function fun(foo: never): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Variable boolean cast with type union',
      code: `
function fun(foo: { fnord: number } | null): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a union of empty and non empty string literals',
      code: `
function fun(foo: 'foo' | ''): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a union with an empty string literal and a non falsy value',
      code: `
function fun(foo: '' | true): boolean {
  return !!foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'String returned in filter callback #docs',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => elt);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `.map()`',
      code: `
function fun(arr: string[]) {
  return arr.map((elt) => ({ elt }));
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with no return value',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {});
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with one statement but not a return statement',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    debugger;
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an empty `Boolean()` call',
      code: `
const foo = Boolean();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array predicate with non-negation unary expression',
      code: `
function fun(arr: number[]) {
  return arr.filter((x) => +x);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a call to a function other than Boolean',
      code: `
const obj = {};
const foo = String(obj);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function not passed to array method',
      code: `
const fn = (x: string) => {
  return {};
};
fn('test');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function not as first argument',
      code: `
const arr: string[] = [];
arr.reduce(
  (acc, elt) => acc,
  (x: string) => {
    return {};
  },
);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function as first arg to non-member call',
      code: `
const filter = (fn: (x: string) => boolean, arr: string[]) => arr;
filter(() => true, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method with computed property',
      code: `
const arr: string[] = [];
arr['filter'](() => true);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Custom object with filter method taking callback in second position',
      code: `
const customObj = {
  filter: (thisArg: any, callback: () => boolean) => callback(),
};
customObj.filter({}, () => true);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with mixed truthy and falsy returns',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    if (elt) {
      return { a: 1 };
    }
    return null;
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some enum comparison',
      code: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    return elt === quux;
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Boolean cast on a plain object #docs',
      code: `
const obj = {};
export const foo = !!obj;
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const obj = {};
export const foo = true;
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
      name: 'With a simple negation on an empty string',
      code: `
const foo = '';
const bar = !foo;
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const foo = '';
const bar = true;
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
      name: 'With a simple negation on a non empty string',
      code: `
const foo = 'foo';
const bar = !foo;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const foo = 'foo';
const bar = false;
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
      name: 'With a simple negation on an array',
      code: `
const arr = [1, 2, 3];
const foo = !arr;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const arr = [1, 2, 3];
const foo = false;
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
      name: 'Boolean cast on an array',
      code: `
const arr = [1, 2, 3];
export const foo = !!arr;
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const arr = [1, 2, 3];
export const foo = true;
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
      name: 'Boolean call on a plain object',
      code: `
const obj = {};
export const foo = Boolean(obj);
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const obj = {};
export const foo = true;
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
      name: 'Boolean cast on a non-empty string literal #docs',
      code: `
const str = 'foo';
export const foo = !!str;
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const str = 'foo';
export const foo = true;
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
      name: 'Boolean cast on an empty string literal #docs',
      code: `
const str = '';
export const foo = !!str;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const str = '';
export const foo = false;
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
      name: 'With a union of non empty string literals',
      code: `
function fun(foo: 'foo' | 'bar'): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
function fun(foo: 'foo' | 'bar'): boolean {
  return true;
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
      name: 'With a union with an empty string literal',
      code: `
function fun(foo: '' | null): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(foo: '' | null): boolean {
  return false;
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
      name: 'Boolean cast on a non falsy number literal #docs',
      code: `
const n = -42;
export const foo = !!n;
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const n = -42;
export const foo = true;
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
      name: 'Boolean cast on a falsy number literal #docs',
      code: `
const n = 0;
export const foo = !!n;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const n = 0;
export const foo = false;
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
      name: 'Boolean cast on a falsy number literal (-0)',
      code: `
const n = -0;
export const foo = !!n;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const n = -0;
export const foo = false;
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
      name: 'Boolean cast on a non falsy bigint literal #docs',
      code: `
const n = -42n;
export const foo = !!n;
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const n = -42n;
export const foo = true;
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
      name: 'Boolean cast on a falsy bigint literal #docs',
      code: `
const n = 0n;
export const foo = !!n;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const n = 0n;
export const foo = false;
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
      name: 'Boolean cast on a falsy bigint literal (-0n)',
      code: `
const n = -0n;
export const foo = !!n;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const n = -0n;
export const foo = false;
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
      name: 'Plain object returned in filter callback #docs',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => ({ elt }));
}
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
function fun(arr: string[]) {
  return arr.filter((elt) => (true));
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
      name: 'Arrow function with a body',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    return { elt };
  });
}
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    return true;
  });
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
      name: 'Function expression',
      code: `
function fun(arr: string[]) {
  return arr.filter(function (elt) {
    return { elt };
  });
}
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
function fun(arr: string[]) {
  return arr.filter(function (elt) {
    return true;
  });
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
      name: '`true` returned in filter callback #docs',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`false` returned in filter callback #docs',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => false);
}
`,
      errors: [{ messageId: 'alwaysFalsy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a unary expression in return type',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => !{ elt });
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(arr: string[]) {
  return arr.filter((elt) => false);
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
      name: 'With a type predicate in return type',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt): elt is '' => !{ elt });
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(arr: string[]) {
  return arr.filter((elt): elt is '' => false);
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
      name: 'With `every`',
      code: `
function fun(arr: string[]) {
  return arr.every((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `some`',
      code: `
function fun(arr: string[]) {
  return arr.some((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `find`',
      code: `
function fun(arr: string[]) {
  return arr.find((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `findIndex`',
      code: `
function fun(arr: string[]) {
  return arr.findIndex((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `findLast`',
      code: `
function fun(arr: string[]) {
  return arr.findLast((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `findLastIndex`',
      code: `
function fun(arr: string[]) {
  return arr.findLastIndex((elt) => true);
}
`,
      errors: [{ messageId: 'alwaysTruthy' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `null`',
      code: `
function fun(foo: null): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(foo: null): boolean {
  return false;
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
      name: 'With `undefined`',
      code: `
function fun(foo: undefined): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(foo: undefined): boolean {
  return false;
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
      name: 'With `null | undefined`',
      code: `
function fun(foo: null | undefined): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(foo: null | undefined): boolean {
  return false;
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
      name: 'With `false`',
      code: `
function fun(foo: false): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(foo: false): boolean {
  return false;
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
      name: 'With `true`',
      code: `
function fun(foo: true): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
function fun(foo: true): boolean {
  return true;
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
      name: 'With `void`',
      code: `
function fun(foo: void): boolean {
  return !!foo;
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
function fun(foo: void): boolean {
  return false;
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
      name: 'Single negation on object literal',
      code: `
const foo = !{};
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          line: 2,
          endLine: 2,
          column: 13,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const foo = false;
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
      name: 'Double negation on object literal',
      code: `
const foo = !!{};
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          line: 2,
          endLine: 2,
          column: 13,
          endColumn: 17,
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const foo = true;
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
      name: 'Triple negation on object literal',
      code: `
const foo = !!!{};
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          line: 2,
          endLine: 2,
          column: 14,
          endColumn: 18,
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const foo = !true;
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
      name: 'Array predicate with unary plus on constant',
      code: `
const arr = [1, 2, 3];
arr.filter((x) => +1);
`,
      errors: [
        {
          messageId: 'alwaysTruthy',
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
const arr = [1, 2, 3];
arr.filter((x) => true);
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
      name: 'Negation of unary plus',
      code: `
const foo = !+1;
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
const foo = false;
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
      name: 'Predicate with several statements in body',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    debugger;
    return { elt };
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with empty return statement',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    return;
  });
}
`,
      errors: [{ messageId: 'falsyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with mixed empty and falsy returns',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    if (elt) {
      return;
    }
    return null;
  });
}
`,
      errors: [{ messageId: 'falsyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with if statement returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    if (elt) {
      return { a: 1 };
    }
    return { b: 2 };
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with try-catch returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    try {
      return { a: 1 };
    } catch (e) {
      return { b: 2 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with try-catch-finally returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    try {
      return { a: 1 };
    } catch (e) {
      return { b: 2 };
    } finally {
      return { c: 3 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with for loop returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    for (let i = 0; i < 1; i++) {
      return { a: 1 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with for-in loop returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    for (const key in elt) {
      return { a: 1 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with for-of loop returning objects',
      code: `
function fun(arr: string[][]) {
  return arr.filter((elt) => {
    for (const item of elt) {
      return { a: 1 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with while loop returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    let i = 0;
    while (i < 1) {
      return { a: 1 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with do-while loop returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    let i = 0;
    do {
      return { a: 1 };
    } while (i < 1);
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Predicate with switch statement returning objects',
      code: `
function fun(arr: string[]) {
  return arr.filter((elt) => {
    switch (elt) {
      case 'a':
        return { a: 1 };
      case 'b':
        return { b: 2 };
      default:
        return { c: 3 };
    }
  });
}
`,
      errors: [{ messageId: 'truthyPredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a disjunction with a falsy value in predicate return',
      code: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    const obj = {};
    return !obj || elt === quux;
  });
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          line: 11,
          endLine: 11,
          column: 12,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    const obj = {};
    return false || elt === quux;
  });
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
      name: 'With a disjunction with a truthy value in predicate return',
      code: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    const obj = false;
    return !obj || elt === quux;
  });
}
`,
      errors: [
        {
          messageId: 'truthyPredicate',
          line: 9,
          endLine: 12,
          column: 21,
          endColumn: 4,
        },
        {
          messageId: 'alwaysTruthy',
          line: 11,
          endLine: 11,
          column: 12,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'useTrue',
              output: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    const obj = false;
    return true || elt === quux;
  });
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
      name: 'With a conjunction with a falsy value in predicate return',
      code: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    const obj = {};
    return !obj && elt === quux;
  });
}
`,
      errors: [
        {
          messageId: 'alwaysFalsy',
          line: 11,
          endLine: 11,
          column: 12,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'useFalse',
              output: `
enum Foo {
  BAR = 0,
  BAZ = 1,
  BARBAZ = 2,
}

function fun(arr: number[], quux?: Foo) {
  return arr.filter((elt) => {
    const obj = {};
    return false && elt === quux;
  });
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
  ],
});

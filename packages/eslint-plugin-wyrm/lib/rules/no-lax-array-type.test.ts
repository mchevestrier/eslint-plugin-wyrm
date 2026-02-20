import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-lax-array-type.js';

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
      name: 'No explicit type annotation',
      code: `
function foo() {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type annotation is not wider than the types of the array items #docs',
      code: `
const foo: number[] = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a declared union type alias',
      code: `
type Quux = number | null;
const foo: Quux[] = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some identifiers',
      code: `
declare const quux: number | null;
const foo: (number | null)[] = [1, 2, 3, quux];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Quux` type',
      code: `
const foo: Quux<number | null> = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Array` type',
      code: `
const foo: Array<number> = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Array<number[]>` type',
      code: `
const foo: Array<number[]> = [[1, 2, 3]];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Array<(number | null)[]>` type',
      code: `
const foo: Array<(number | null)[]> = [[1, 2, 3]];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With spread elements',
      code: `
const quux = [4, 5, 6, null];
const foo: (number | null)[] = [1, 2, 3, ...quux];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a single element type and not a single assignable element',
      code: `
const quux: number[] = ['foo', 'bar', 'baz'];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'let binding',
      code: `
let quux: (number | null)[] = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array is mutated later',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.push(null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array is referenced later with includes',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.includes(null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with pop method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.pop();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with reverse method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.reverse();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with shift method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.shift();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with sort method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.sort();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with splice method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.splice(0, 1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with unshift method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.unshift(null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with fill method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.fill(null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with copyWithin method',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.copyWithin(0, 1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Destructuring pattern instead of identifier',
      code: `
const { foo }: { foo: (number | null)[] } = { foo: [1, 2, 3] };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Non-array init',
      code: `
const foo: (number | null)[] = bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty array',
      code: `
const foo: (number | null)[] = [];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with multiple mutations',
      code: `
const quux: (number | null)[] = [1, 2, 3];
quux.push(4);
quux.push(5);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with no type arguments',
      code: `
const foo: Array = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `any`',
      code: `
const foo: any = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a qualified type',
      code: `
namespace Quux {
  export type Bar = Array<string | number>;
}

const foo: Quux.Bar = [1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a sparse array',
      code: `
const foo: Array<number | undefined> = [, , 1, 2, 3];
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Type annotation is wider than the types of the array items #docs',
      code: `
export const foo: (number | null)[] = [1, 2, 3];
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
export const foo: (number  )[] = [1, 2, 3];
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
      name: 'With spread elements',
      code: `
const quux = [4, 5, 6];
export const foo: (number | null)[] = [1, 2, 3, ...quux];
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const quux = [4, 5, 6];
export const foo: (number  )[] = [1, 2, 3, ...quux];
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
      name: 'With `Array` type',
      code: `
const foo: Array<number | null> = [1, 2, 3];
for (const elt of foo) {
}
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo: Array<number  > = [1, 2, 3];
for (const elt of foo) {
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
      name: 'Type to remove is first in the union',
      code: `
const foo: (null | number)[] = [1, 2, 3];
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo: (  number)[] = [1, 2, 3];
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
      name: 'With parenthesized type',
      code: `
const foo: ((null | number))[] = [1, 2, 3];
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo: ((  number))[] = [1, 2, 3];
`,
            },
          ],
        },
      ],
      after() {
        // Not formatted
      },
    },
    {
      name: 'With sparse array (array holes)',
      code: `
const foo: (number | undefined | null)[] = [1, , 3];
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo: (number | undefined  )[] = [1, , 3];
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
      name: 'With union type in array elements',
      code: `
declare const bar: number | string;
const foo: (number | string | null)[] = [1, bar, 3];
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
declare const bar: number | string;
const foo: (number | string  )[] = [1, bar, 3];
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
      name: 'With a function',
      code: `
function fun() {
  const foo: (number | null)[] = [1, 2, 3];
  return foo;
}
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function fun() {
  const foo: (number  )[] = [1, 2, 3];
  return foo;
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
      name: 'With `.filter()`',
      code: `
function fun() {
  const foo: (number | null)[] = [1, 2, 3];
  return foo.filter((x) => x !== null);
}
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function fun() {
  const foo: (number  )[] = [1, 2, 3];
  return foo.filter((x) => x !== null);
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
      name: 'With a reference to a method but no call expression',
      code: `
function fun() {
  const foo: Array<number | null> = [1, 2, 3];
  return foo.push;
}
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function fun() {
  const foo: Array<number  > = [1, 2, 3];
  return foo.push;
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
      name: 'With a reference to a method call but not on the array',
      code: `
const bar = [];

function fun() {
  const includes: Array<number | null> = [1, 2, 3];
  bar[includes]();
}
`,
      errors: [
        {
          messageId: 'noLaxArrayType',
          data: { unusedType: 'null' },
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const bar = [];

function fun() {
  const includes: Array<number  > = [1, 2, 3];
  bar[includes]();
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

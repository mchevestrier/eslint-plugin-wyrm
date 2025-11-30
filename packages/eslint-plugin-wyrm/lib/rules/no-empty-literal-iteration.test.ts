import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-empty-literal-iteration.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`for..of` loop over a non-empty array literal #docs',
      code: `
for (const x of [1, 2, 3]) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over a sparse array literal',
      code: `
for (const x of [, , ,]) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over `new` expression',
      code: `
for (const x of new Klass()) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over `new` expression where callee is not an identifier',
      code: `
for (const x of new (1 ? Set : Map)()) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over call expression',
      code: `
for (const x of foo()) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over called member expression where callee is not an identifier',
      code: `
for (const x of obj[1 ? 'foo' : 'bar']()) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over identifier',
      code: `
for (const x of arr) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over `new Set([1, 2, 3])`',
      code: `
for (const x of new Set([1, 2, 3])) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.push()` into an empty array',
      code: `
[].push(42);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`for..of` loop over an empty array #docs',
      code: `
for (const x of []) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop over an empty string #docs',
      code: `
for (const x of '') {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..in` loop over an empty object #docs',
      code: `
for (const x in {}) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.find()` over an empty array',
      code: `
[].find(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.every()` over an empty array',
      code: `
[].every(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.filter()` over an empty array',
      code: `
[].filter(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.findLast()` over an empty array',
      code: `
[].findLast(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.findIndex()` over an empty array',
      code: `
[].findIndex(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.findLastIndex()` over an empty array',
      code: `
[].findLastIndex(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.forEach()` over an empty array #docs',
      code: `
[].forEach(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.includes()` over an empty array',
      code: `
[].includes(42);
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.map()` over an empty array #docs',
      code: `
[].map(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.reduce()` over an empty array #docs',
      code: `
[].reduce(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.some()` over an empty array #docs',
      code: `
[].some(() => {});
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty array in `as` expression',
      code: `
for (const x of [] as string[]) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty array in `satisfies` expression',
      code: `
for (const x of [] satisfies string[]) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty array in non-null expression',
      code: `
for (const x of []!) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` over `new Array()`',
      code: `
for (const x of new Array()) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` over `new Set()`',
      code: `
for (const x of new Set()) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..in` over `new Object()`',
      code: `
for (const x in new Object()) {
}
`,
      errors: [{ messageId: 'noEmptyLiteralIteration' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

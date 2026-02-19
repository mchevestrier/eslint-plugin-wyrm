import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-object-keys-values.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With `.find()` #docs',
      code: `
const entry = Object.entries(foo).find(([key]) => key === 'fnord');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `.filter()` #docs',
      code: `
const entries = Object.entries(foo).filter(([key]) => key === 'fnord');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Object.entries().map()`, using keys and values #docs',
      code: `
const entries = Object.entries(foo).map(([key, value]) => ({ key, value }));
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Object.entries().map()`, and no array pattern in first param',
      code: `
const entries = Object.entries(foo).map((entry) => [...entry, 42]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Object.entries().map()`, but no argument',
      code: `
const entries = Object.entries(foo).map();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Object.entries().map()`, but no function expression argument',
      code: `
const entries = Object.entries(foo).map(callback);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Object.entries().map()`, but no param in callback',
      code: `
const entries = Object.entries(foo).map(() => 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-member expression callee',
      code: `
const entries = someFunction().map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With computed property in callee',
      code: `
const entries = Object.entries(foo)['map'](([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-call expression object',
      code: `
const entries = obj.map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-call expression as callee object',
      code: `
const entries = someVar.map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-identifier object',
      code: `
const entries = obj['Object'].entries(foo).map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With computed property in nested callee',
      code: `
const entries = Object['entries'](foo).map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-Object identifier',
      code: `
const entries = MyObject.entries(foo).map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-entries method',
      code: `
const entries = Object.keys(foo).map(([key]) => key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With more than 2 destructured params',
      code: `
const entries = Object.entries(foo).map(([, value, extra]) => value);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With `Object.entries().map()`, only using keys #docs',
      code: `
const keys = Object.entries(foo).map(([key]) => key.toUpperCase());
`,
      errors: [
        {
          messageId: 'preferObjectKeys',
          suggestions: [
            {
              messageId: 'useObjectKeys',
              output: `
const keys = Object.keys(foo).map((key) => key.toUpperCase());
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
      name: 'With `Object.entries().map()`, only using values #docs',
      code: `
const values = Object.entries(foo).map(([, value]) => value.toUpperCase());
`,
      errors: [
        {
          messageId: 'preferObjectValues',
          suggestions: [
            {
              messageId: 'useObjectValues',
              output: `
const values = Object.values(foo).map((value) => value.toUpperCase());
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
      name: 'With `Object.entries().map()`, only using values in a function expression',
      code: `
const values = Object.entries(foo).map(function ([, value]) {
  return value.toUpperCase();
});
`,
      errors: [
        {
          messageId: 'preferObjectValues',
          suggestions: [
            {
              messageId: 'useObjectValues',
              output: `
const values = Object.values(foo).map(function (value) {
  return value.toUpperCase();
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
      name: 'With `Object.entries().forEach()`, only using values #docs',
      code: `
Object.entries(foo).forEach(function ([, value]) {
  console.log(value);
});
`,
      errors: [
        {
          messageId: 'preferObjectValues',
          suggestions: [
            {
              messageId: 'useObjectValues',
              output: `
Object.values(foo).forEach(function (value) {
  console.log(value);
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
      name: 'With `Object.entries().every()`, only using keys #docs',
      code: `
const ok = Object.entries(foo).every(([key]) => key.toUpperCase() === key);
`,
      errors: [
        {
          messageId: 'preferObjectKeys',
          suggestions: [
            {
              messageId: 'useObjectKeys',
              output: `
const ok = Object.keys(foo).every((key) => key.toUpperCase() === key);
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
      name: 'With `Object.entries().some()`, only using values #docs',
      code: `
const ok = Object.entries(foo).some(([, value]) => value.toUpperCase() === value);
`,
      errors: [
        {
          messageId: 'preferObjectValues',
          suggestions: [
            {
              messageId: 'useObjectValues',
              output: `
const ok = Object.values(foo).some((value) => value.toUpperCase() === value);
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

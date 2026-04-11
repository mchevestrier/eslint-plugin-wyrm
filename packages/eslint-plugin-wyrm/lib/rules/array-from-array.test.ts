import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './array-from-array.js';

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
      name: '`Array.from` called on an iterator #docs',
      code: `
let s = new Set<number>();
s.add(42);
s.add(105);

Array.from(s);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Array.from` called on an iterator, with a map function #docs',
      code: `
let s = new Set<number>();
s.add(42);
s.add(105);

Array.from(s, (n) => n + 2);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `Array.from` call',
      code: `
Array.from();
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`Array.from` called on an array #docs',
      code: `
const arr = [1, 2, 3];
Array.from(arr);
`,
      output: `
const arr = [1, 2, 3];
[...arr];
`,
      errors: [{ messageId: 'noArrayFromArray' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Array.from` called on an array, with a map function #docs',
      code: `
const arr = [1, 2, 3];
Array.from(arr, (n) => n + 2);
`,
      output: `
const arr = [1, 2, 3];
arr.map((n) => n + 2);
`,
      errors: [{ messageId: 'noArrayFromArray' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Array.from` called on an tuple #docs',
      code: `
const arr = [1, 2, 3] as const;
Array.from(arr);
`,
      output: `
const arr = [1, 2, 3] as const;
[...arr];
`,
      errors: [{ messageId: 'noArrayFromArray' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Array.from` called on an tuple, with a map function #docs',
      code: `
const arr = [1, 2, 3] as const;
Array.from(arr, (n) => n + 2);
`,
      output: `
const arr = [1, 2, 3] as const;
arr.map((n) => n + 2);
`,
      errors: [{ messageId: 'noArrayFromArray' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

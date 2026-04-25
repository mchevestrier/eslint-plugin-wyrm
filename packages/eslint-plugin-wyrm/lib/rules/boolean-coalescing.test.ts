import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './boolean-coalescing.js';

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
      name: 'With a possibly nullish and possibly falsy left side #docs',
      code: `
function fun(foo: string | null, bar: string | null) {
  return !(foo ?? bar);
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With a possibly nullish but not possibly falsy left side #docs',
      code: `
function fun(foo: object | null, bar: string | null) {
  return !(foo ?? bar);
}
`,
      output: `
function fun(foo: object | null, bar: string | null) {
  return !(!!(foo) || !!(bar));
}
`,
      errors: [{ messageId: 'booleanCoalescing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a double negation',
      code: `
function fun(foo: object | null, bar: string | null) {
  return !!(foo ?? bar);
}
`,
      output: `
function fun(foo: object | null, bar: string | null) {
  return !!(!!(foo) || !!(bar));
}
`,
      errors: [{ messageId: 'booleanCoalescing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Boolean call',
      code: `
function fun(foo: object | null, bar: string | null) {
  return Boolean(foo ?? bar);
}
`,
      output: `
function fun(foo: object | null, bar: string | null) {
  return Boolean(!!(foo) || !!(bar));
}
`,
      errors: [{ messageId: 'booleanCoalescing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a condition',
      code: `
function fun(foo: object | null, bar: string | null) {
  if (foo ?? bar) {
    return 'ok';
  }
  return 'no';
}
`,
      output: `
function fun(foo: object | null, bar: string | null) {
  if (!!(foo) || !!(bar)) {
    return 'ok';
  }
  return 'no';
}
`,
      errors: [{ messageId: 'booleanCoalescing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a predicate',
      code: `
declare const bar: string | null;
[{}, null].filter((foo) => foo ?? bar);
`,
      output: `
declare const bar: string | null;
[{}, null].filter((foo) => !!(foo) || !!(bar));
`,
      errors: [{ messageId: 'booleanCoalescing' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

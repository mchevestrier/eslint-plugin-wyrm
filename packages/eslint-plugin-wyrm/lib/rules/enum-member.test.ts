import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './enum-member.js';

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
      name: 'Using an enum member #docs',
      code: `
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

export const fnord = FooEnum.BAR;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a string literal not part of enum values and a type assertion #docs',
      code: `
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

const fnord = 'fnord' as FooEnum;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a number literal not part of enum values and a type assertion #docs',
      code: `
enum FooEnum {
  BAR = 12,
  QUUX = 25,
}

const fnord = 42 as FooEnum;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With a string literal and a type assertion #docs',
      code: `
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

const fnord = 'bar' as FooEnum;
`,
      output: `
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

const fnord = FooEnum.BAR;
`,
      errors: [{ messageId: 'preferEnumMember' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a number literal and a type assertion #docs',
      code: `
enum FooEnum {
  BAR = 12,
  QUUX = 25,
}

const fnord = 25 as FooEnum;
`,
      output: `
enum FooEnum {
  BAR = 12,
  QUUX = 25,
}

const fnord = FooEnum.QUUX;
`,
      errors: [{ messageId: 'preferEnumMember' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

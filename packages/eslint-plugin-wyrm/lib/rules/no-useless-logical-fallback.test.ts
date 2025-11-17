import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-logical-fallback.js';

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
      name: 'Possibly `null` with fallback to `undefined` #docs',
      code: `
function quux(foo: string | null) {
  return foo ?? undefined;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Possibly `undefined` with fallback to `null` #docs',
      code: `
function quux(foo: string | undefined) {
  return foo ?? null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`|| false` when the left side is not exclusively a boolean',
      code: `
function quux(foo: boolean | number) {
  return foo || false;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`|| true` when the left side is not exclusively a boolean',
      code: `
function quux(foo: boolean | number) {
  return foo || true;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`&& false` when the left side is not exclusively a boolean',
      code: `
function quux(foo: boolean | number) {
  return foo && false;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`&& true` when the left side is not exclusively a boolean',
      code: `
function quux(foo: boolean | number) {
  return foo && true;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "`|| ''` when the left side is not exclusively a string",
      code: `
function quux(foo: string | number) {
  return foo || '';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`|| 0` when the left side is not exclusively a number',
      code: `
function quux(foo: string | number) {
  return foo || 0;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`||` expression when the right side is not a literal',
      code: `
function quux(foo: string | number) {
  return foo || Math.cos(0);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`&&` expression when the right side is not a literal',
      code: `
function quux(foo: string | number) {
  return foo && Math.cos(0);
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With `?? undefined` #docs',
      code: `
function quux(foo: string | undefined) {
  return foo ?? undefined;
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '?? undefined' },
              output: `
function quux(foo: string | undefined) {
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
      name: 'With `?? null` #docs',
      code: `
function quux(foo: string | null) {
  return foo ?? null;
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '?? null' },
              output: `
function quux(foo: string | null) {
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
      name: 'With `|| false` #docs',
      code: `
function quux(foo: boolean) {
  return foo || false;
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '|| false' },
              output: `
function quux(foo: boolean) {
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
      name: 'With `&& true` #docs',
      code: `
function quux(foo: boolean) {
  return foo && true;
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '&& true' },
              output: `
function quux(foo: boolean) {
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
      name: 'With `&& false` (constant expression) #docs',
      code: `
function quux(foo: boolean) {
  return foo && false;
}
`,
      errors: [
        {
          messageId: 'noConstantExpression',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '&& false' },
              output: `
function quux(foo: boolean) {
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
      name: 'With `|| true` (constant expression) #docs',
      code: `
function quux(foo: boolean) {
  return foo || true;
}
`,
      errors: [
        {
          messageId: 'noConstantExpression',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '|| true' },
              output: `
function quux(foo: boolean) {
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
      name: "`|| ''` when the left side is exclusively a string #docs",
      code: `
function quux(foo: string) {
  return foo || '';
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: "|| ''" },
              output: `
function quux(foo: string) {
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
      name: '`|| 0` when the left side is exclusively a number',
      code: `
function quux(foo: number) {
  return foo || 0;
}
`,
      errors: [
        {
          messageId: 'noNumberOrZero',
          suggestions: [
            {
              messageId: 'replaceByIsNaNCheck',
              output: `
function quux(foo: number) {
  return Number.isNaN(foo) ? 0 : foo;
}
`,
            },
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '|| 0' },
              output: `
function quux(foo: number) {
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
      name: 'With `null ?? null`',
      code: `
function quux(foo: null) {
  return foo ?? null;
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '?? null' },
              output: `
function quux(foo: null) {
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
      name: 'With `undefined ?? undefined`',
      code: `
function quux(foo: undefined) {
  return foo ?? undefined;
}
`,
      errors: [
        {
          messageId: 'noUselessLogicalFallback',
          suggestions: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '?? undefined' },
              output: `
function quux(foo: undefined) {
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
  ],
});

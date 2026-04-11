import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './useless-as-const.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No type annotation #docs',
      code: `
export const foo = 'foo' as const;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No `as const` assertion #docs',
      code: `
export const foo: string = 'foo';
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`as const` assertion in declaration with a type annotation #docs',
      code: `
export const foo: string = 'foo' as const;
`,
      errors: [
        {
          messageId: 'uselessAsConst',
          suggestions: [
            {
              messageId: 'removeAsConst',
              output: `
export const foo: string = 'foo';
`,
            },
            {
              messageId: 'removeTypeAnnotation',
              output: `
export const foo = 'foo' as const;
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
      name: 'With an array',
      code: `
export const foo: string[] = ['foo'] as const;
`,
      errors: [
        {
          messageId: 'uselessAsConst',
          suggestions: [
            {
              messageId: 'removeAsConst',
              output: `
export const foo: string[] = ['foo'];
`,
            },
            {
              messageId: 'removeTypeAnnotation',
              output: `
export const foo = ['foo'] as const;
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

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './suspicious-map-length.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Correct use of `.filter().length` #docs',
      code: `
export const z = [1, 2].filter((x) => x > 2).length;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not an identifier',
      code: `
export const z = [1, 2].map((x) => x > 2)['length'];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
export const z = [1, 2]['map']((x) => x > 2).length;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not a call expression',
      code: `
export const z = foo.length;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee is not a member expression',
      code: `
export const z = foo().length;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Suspicious use of `.map().length` #docs',
      code: `
export const z = [1, 2].map((x) => x > 2).length;
`,
      errors: [
        {
          messageId: 'suspiciousMapLength',
          suggestions: [
            {
              messageId: 'useFilter',
              output: `
export const z = [1, 2].filter((x) => x > 2).length;
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

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-repeat.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using `String.prototype.repeat` #docs',
      code: `const x = '*'.repeat(3);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Not using `String.prototype.repeat` #docs Array.from with reduce and suffix template expression',
      code: `const x = Array.from({ length: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `const x = '*'.repeat(3);
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
      name: 'Array.from with reduce and prefix template expression',
      code: `const x = Array.from({ length: 3 }).reduce((acc) => \`*\${acc}\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `const x = '*'.repeat(3);
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
      name: 'Array.from with reduce and `String.prototype.concat`',
      code: `const x = Array.from({ length: 3 }).reduce((acc) => acc.concat('*'), '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `const x = '*'.repeat(3);
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
      name: 'With array constructor',
      code: `const x = Array(3)
  .fill(undefined)
  .reduce((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `const x = '*'.repeat(3);
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
      name: 'With array constructor (new expression)',
      code: `const x = new Array(3).fill(undefined).reduce((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `const x = '*'.repeat(3);
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
      name: 'With generic type argument',
      code: `const x = Array.from({ length: 3 }).reduce<string>((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `const x = '*'.repeat(3);
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
      name: 'With accumulator parameter type annotation',
      code: `const x = Array.from({ length: 3 }).reduce((acc: string) => acc.concat('&'), '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'&'.repeat(3)" },
              output: `const x = '&'.repeat(3);
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
      name: 'Inside a one-parameter function',
      code: `function repeat(n: number) {
  return Array.from({ length: n }).reduce<string>((acc) => \`\${acc}Uw\`, '');
}
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'Uw'.repeat(n)" },
              output: `function repeat(n: number) {
  return 'Uw'.repeat(n);
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
      name: 'Inside a two-parameter function',
      code: `function repeat(str: string, n: number) {
  return Array.from({ length: n }).reduce<string>((acc) => \`\${acc}\${str}\`, '');
}
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: 'str.repeat(n)' },
              output: `function repeat(str: string, n: number) {
  return str.repeat(n);
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

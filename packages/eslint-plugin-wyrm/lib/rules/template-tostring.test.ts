import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './template-tostring.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Plain number in a template literal #docs',
      code: `
const n = 42;
const str = \`\${n}\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a number in a tagged template literal #docs',
      code: `
const n = 42;
const str = foo\`\${n.toString()}\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple call expression',
      code: `
const n = 42;
const str = \`\${toString()}\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property key is a string literal',
      code: `
const n = 42;
const str = \`\${n['toString']()}\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not `toString()`',
      code: `
const n = 42;
const str = \`\${n.notToString()}\`;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Calling `.toString()` on a number in a template literal #docs',
      code: `
const n = 42;
const str = \`\${n.toString()}\`;
`,
      output: `
const n = 42;
const str = \`\${n}\`;
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a number literal in a template literal',
      code: `
const str = \`\${(42).toString()}\`;
`,
      output: `
const str = \`\${42}\`;
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

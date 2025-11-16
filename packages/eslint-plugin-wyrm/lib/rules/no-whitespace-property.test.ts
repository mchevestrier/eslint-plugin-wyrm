import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-whitespace-property.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Whitespace inside text #docs',
      code: `const obj = { 'foo bar': 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property key is not a literal',
      code: `const obj = { foo: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property key is a boolean literal',
      code: `const obj = { [true]: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Leading whitespace #docs',
      code: `const obj = { ' foo': 42 };
`,
      errors: [{ messageId: 'noWhitespace' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Trailing whitespace #docs',
      code: `const obj = { 'foo ': 42 };
`,
      errors: [{ messageId: 'noWhitespace' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Leading and trailing whitespace',
      code: `const obj = { ' foo ': 42 };
`,
      errors: [{ messageId: 'noWhitespace' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TypeScript object type declaration #docs',
      code: `type Obj = { ' foo': 42 };
`,
      errors: [{ messageId: 'noWhitespace' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

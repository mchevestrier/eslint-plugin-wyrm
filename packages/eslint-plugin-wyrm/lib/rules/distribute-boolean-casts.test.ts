import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './distribute-boolean-casts.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Distributed boolean cast #docs',
      code: `const foo = !!bar && baz.length > 2 && !!quux.description;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'An entire logical expression wrapped in a boolean cast #docs',
      code: `const foo = !!(bar && baz.length > 2 && quux.description);
`,
      output: [
        `const foo = !!(bar && baz.length > 2) && !!(quux.description);
`,
        `const foo = !!(bar) && baz.length > 2 && !!(quux.description);
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing expressions are wrapped in a boolean cast',
      code: `const foo = !!(bar && baz.length > 2 && (quux.description ?? 'Default description'));
`,
      output: [
        `const foo = !!(bar && baz.length > 2) && !!(quux.description ?? 'Default description');
`,
        `const foo = !!(bar) && baz.length > 2 && !!(quux.description ?? 'Default description');
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

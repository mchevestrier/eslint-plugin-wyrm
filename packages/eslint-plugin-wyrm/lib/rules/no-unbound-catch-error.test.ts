import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-unbound-catch-error.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Bound error in `catch` clause #docs',
      code: `
try {
  // ...
} catch (err) {
  // ...
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Unbound error in `catch` clause #docs',
      code: `
try {
  // ...
} catch {
  // ...
}
`,
      errors: [{ messageId: 'noUnboundError' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

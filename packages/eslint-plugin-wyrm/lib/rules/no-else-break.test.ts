import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-else-break.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No `else` block necessary #docs',
      code: `while (true) {
  if (cond) break;
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Unnecessary `else` block after `break` #docs',
      code: `while (true) {
  if (cond) break;
  else foo();
}
`,
      output: `while (true) {
  if (cond) break;
   foo();
}
`,
      errors: [{ messageId: 'noElseBreak' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` block after `break` (block condition)',
      code: `while (true) {
  if (cond) {
    break;
  } else {
    foo();
  }
}
`,
      output: `while (true) {
  if (cond) {
    break;
  }  foo();
}
`,
      errors: [{ messageId: 'noElseBreak' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else if` block after `break`',
      code: `while (true) {
  if (cond) {
    break;
  } else if (quux) {
    foo();
  }
}
`,
      output: `while (true) {
  if (cond) {
    break;
  }  if (quux) {
    foo();
  }
}
`,
      errors: [{ messageId: 'noElseBreak' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

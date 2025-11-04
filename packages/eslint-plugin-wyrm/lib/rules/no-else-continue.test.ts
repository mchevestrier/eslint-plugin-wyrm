import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-else-continue.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No `else` block necessary #docs',
      code: `while (true) {
  if (cond) continue;
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
      name: 'Unnecessary `else` block after `continue` #docs',
      code: `while (true) {
  if (cond) continue;
  else foo();
}
`,
      output: `while (true) {
  if (cond) continue;
   foo();
}
`,
      errors: [{ messageId: 'noElseContinue' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` block after `continue` (block condition)',
      code: `while (true) {
  if (cond) {
    continue;
  } else {
    foo();
  }
}
`,
      output: `while (true) {
  if (cond) {
    continue;
  }  foo();
}
`,
      errors: [{ messageId: 'noElseContinue' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else if` block after `continue`',
      code: `while (true) {
  if (cond) {
    continue;
  } else if (quux) {
    foo();
  }
}
`,
      output: `while (true) {
  if (cond) {
    continue;
  }  if (quux) {
    foo();
  }
}
`,
      errors: [{ messageId: 'noElseContinue' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

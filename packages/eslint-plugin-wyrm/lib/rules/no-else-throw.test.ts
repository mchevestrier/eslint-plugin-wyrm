import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-else-throw.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No `else` block necessary #docs',
      code: `if (cond) throw Error('oh no!');
foo();
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Unnecessary `else` block after `throw` #docs',
      code: `if (cond) throw Error('oh no!');
else foo();
`,
      output: `if (cond) throw Error('oh no!');
 foo();
`,
      errors: [{ messageId: 'noElseThrow' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` block after `throw` (block condition)',
      code: `if (cond) {
  throw Error('oh no!');
} else {
  foo();
}
`,
      output: `if (cond) {
  throw Error('oh no!');
}  foo();
`,
      errors: [{ messageId: 'noElseThrow' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else if` block after `throw`',
      code: `if (cond) {
  throw Error('oh no!');
} else if (quux) {
  foo();
}
`,
      output: `if (cond) {
  throw Error('oh no!');
}  if (quux) {
  foo();
}
`,
      errors: [{ messageId: 'noElseThrow' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

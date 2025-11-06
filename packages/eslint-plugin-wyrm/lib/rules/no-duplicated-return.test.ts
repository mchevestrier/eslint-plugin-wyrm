import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-duplicated-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No duplicated return #docs',
      code: `function foo() {
  if (Math.random()) return null;
  if (Math.random()) return null;
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Return value is the same for the early return and the final return #docs',
      code: `function foo() {
  if (Math.random()) return null;
  return null;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several early returns',
      code: `function foo() {
  if (Math.random()) return null;
  if (Math.random()) return null;
  return null;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function',
      code: `const foo = () => {
  if (Math.random()) return null;
  return null;
};
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `const foo = function () {
  if (Math.random()) return null;
  return null;
};
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A convoluted example where return values are actually not invariant (but the condition is still unnecessary)',
      code: `function foo() {
  let bar = 'ok';
  const changeBar = () => {
    if (Math.random() > 0.5) {
      bar = 'KO';
      return true;
    }
    return false;
  };

  if (changeBar()) return bar;
  return bar;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

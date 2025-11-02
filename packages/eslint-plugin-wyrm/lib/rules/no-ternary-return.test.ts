import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-ternary-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No ternary return #docs',
      code: `function foo(cond: boolean) {
  if (cond) return 42;
  return 105;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inline arrow function #docs',
      code: `const foo = (cond: boolean) => (cond ? 42 : 105);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Single line ternary return (with `allowSingleLine: true`)',
      options: [{ allowSingleLine: true }],
      code: `function foo(cond: boolean) {
  return cond ? 42 : 105;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Ternary return #docs',
      code: `function foo(cond: boolean) {
  return cond ? 42 : 105;
}
`,
      output: `function foo(cond: boolean) {
  if (cond) return 42;
  return 105;
}
`,
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary return in block arrow function',
      code: `const foo = (cond: boolean) => {
  return cond ? 42 : 105;
};
`,
      output: `const foo = (cond: boolean) => {
  if (cond) return 42;
  return 105;
};
`,
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multi-line ternary return',
      code: `function foo(cond: boolean) {
  return cond
    ? {
        prop: 42,
      }
    : { prop: 105 };
}
`,
      output: `function foo(cond: boolean) {
  if (cond) return {
        prop: 42,
      };
  return { prop: 105 };
}
`,
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multi-line ternary return (with `allowSingleLine: true`)',
      options: [{ allowSingleLine: true }],
      code: `function foo(cond: boolean) {
  return cond
    ? {
        prop: 42,
      }
    : { prop: 105 };
}
`,
      output: `function foo(cond: boolean) {
  if (cond) return {
        prop: 42,
      };
  return { prop: 105 };
}
`,
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

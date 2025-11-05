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
  if (cond) {return 42;}
  else {return 105;}
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
  if (cond) {return 42;}
  else {return 105;}
};
`,
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nested ternary return',
      code: `function foo(cond1: boolean, cond2: boolean) {
  return cond1 ? 42 : cond2 ? 105 : 0;
}
`,
      output: [
        `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {return 42;}
  else {return cond2 ? 105 : 0;}
}
`,
        `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {return 42;}
  else {if (cond2) {return 105;}
        else {return 0;}}
}
`,
      ],
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nested ternary return with ternary in consequent',
      code: `function foo(cond1: boolean, cond2: boolean) {
  return cond1 ? (cond2 ? 105 : 0) : 42;
}
`,
      output: [
        `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {return cond2 ? 105 : 0;}
  else {return 42;}
}
`,
        `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {if (cond2) {return 105;}
              else {return 0;}}
  else {return 42;}
}
`,
      ],
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
  if (cond) {return {
        prop: 42,
      };}
  else {return { prop: 105 };}
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
  if (cond) {return {
        prop: 42,
      };}
  else {return { prop: 105 };}
}
`,
      errors: [{ messageId: 'noTernaryReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

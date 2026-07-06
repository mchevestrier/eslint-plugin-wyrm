import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './duplicate-condition.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No duplicate condition #docs',
      code: `
if (foo > 42) {
  return 'foo';
}
if (bar > 42) {
  return 'bar';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No return statement in the first condition',
      code: `
if (foo > 42) {
  console.log('foo');
}
if (foo > 42) {
  console.log('bar');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Previous statement has no exit -> allowed duplicate',
      code: `
if (foo > 42) {
  console.log('foo');
}
if (foo > 42) {
  return 'bar';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With almost duplicate conditions',
      code: `
if (foo > 42) {
  return 'foo';
}
if (42 <= foo) {
  return 'bar';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non flippable operator',
      code: `
if (foo in bar) {
  return 'foo';
}
if (bar in foo) {
  return 'bar';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nested if statement is ignored (parent is IfStatement)',
      code: `
if (foo > 42) {
  if (foo > 42) {
    return 'bar';
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Non-equivalent due to different literal/operator semantics',
      code: `
if (foo >= 42) {
  return 'foo';
}
if (foo > 42) {
  return 'bar';
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],

  invalid: [
    {
      name: 'Duplicate condition #docs',
      code: `
if (foo > 42) {
  return 'foo';
}
if (foo > 42) {
  return 'bar';
}
`,
      errors: [{ messageId: 'duplicateCondition' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With reverse duplicate conditions',
      code: `
if (foo > 42) {
  return 'foo';
}
if (42 < foo) {
  return 'bar';
}
`,
      errors: [{ messageId: 'duplicateCondition' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With complex reverse duplicate conditions',
      code: `
if (foo > 42 && bar !== 37) {
  return 'foo';
}
if (37 !== bar && 42 < foo) {
  return 'bar';
}
`,
      errors: [{ messageId: 'duplicateCondition' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Member expression reverse duplicate',
      code: `
if (obj.a > 1) {
  return 'foo';
}
if (1 < obj.a) {
  return 'bar';
}
`,
      errors: [{ messageId: 'duplicateCondition' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Logical OR reversed operands',
      code: `
if (a || b) {
  return 'foo';
}
if (b || a) {
  return 'bar';
}
`,
      errors: [{ messageId: 'duplicateCondition' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

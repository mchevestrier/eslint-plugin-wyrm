import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './useless-conditional-assign.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With subsequent statements after the `if` statement #docs',
      code: `
function foo() {
  let bar;

  if (Math.random()) {
    bar = 42;
  } else if (Math.random()) {
    bar = null;
  } else {
    bar = 42 + 105;
  }

  console.log(bar);

  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no final return statement',
      code: `
function foo() {
  let bar;

  if (Math.random()) {
    bar = 42;
  } else if (Math.random()) {
    bar = null;
  } else {
    bar = 42 + 105;
  }

  console.log(bar);
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Simple conditional assignments #docs',
      code: `
function foo() {
  let bar;

  if (Math.random()) {
    bar = 42;
  } else if (Math.random()) {
    bar = 105;
  } else {
    bar = null; // Cannot be fixed
    console.warn('Oh no');
  }

  // No other statements

  return bar;
}
`,
      output: `
function foo() {
  let bar;

  if (Math.random()) {
    return 42;
  } else if (Math.random()) {
    return 105;
  } else {
    bar = null; // Cannot be fixed
    console.warn('Oh no');
  }

  // No other statements

  return bar;
}
`,
      errors: [{ messageId: 'preferDirectReturn' }, { messageId: 'preferDirectReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'In alternate branch',
      code: `
function foo() {
  let bar;

  if (Math.random()) {
    bar = 42;
  } else if (Math.random()) {
    bar = null;
    console.log('Oh no');
  } else {
    bar = 42 + 105;
  }

  // No other statements

  return bar;
}
`,
      output: `
function foo() {
  let bar;

  if (Math.random()) {
    return 42;
  } else if (Math.random()) {
    bar = null;
    console.log('Oh no');
  } else {
    return 42 + 105;
  }

  // No other statements

  return bar;
}
`,
      errors: [{ messageId: 'preferDirectReturn' }, { messageId: 'preferDirectReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an assignment operator',
      code: `
function foo() {
  let bar = -2;

  if (Math.random()) {
    bar += 42;
  } else if (Math.random()) {
    bar = null;
    console.log('Oh no');
  } else {
    bar = 42 + 105;
  }

  // No other statements

  return bar;
}
`,
      output: `
function foo() {
  let bar = -2;

  if (Math.random()) {
    bar += 42;
  } else if (Math.random()) {
    bar = null;
    console.log('Oh no');
  } else {
    return 42 + 105;
  }

  // No other statements

  return bar;
}
`,
      errors: [{ messageId: 'preferDirectReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

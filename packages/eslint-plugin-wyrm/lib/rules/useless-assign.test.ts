import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './useless-assign.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With a subsequent statement before the return statement #docs',
      code: `
function foo() {
  const bar = 42 + 105;

  console.log(bar);

  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `using` #docs',
      code: `
function foo() {
  using bar = quux();
  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `var`',
      code: `
function foo() {
  var bar = 42 + 105;
  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an assignment expression',
      code: `
let bar;

function foo() {
  bar = 42 + 105;
  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a multi-line expression',
      code: `
function foo() {
  const bar = [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a multi-line expression and `allowMultiLine: true` #docs',
      options: [{ allowMultiLine: true }],
      code: `
function foo() {
  const bar = [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Simple variable declaration #docs',
      code: `
function foo() {
  const bar = 42 + 105;
  return bar;
}
`,
      output: `
function foo() {
  
  return 42 + 105;
}
`,
      errors: [{ messageId: 'uselessAssign' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `let`',
      code: `
function foo() {
  let bar = 42 + 105;
  return bar;
}
`,
      output: `
function foo() {
  
  return 42 + 105;
}
`,
      errors: [{ messageId: 'uselessAssign' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several declarators #docs',
      code: `
function foo() {
  const bar = 42 + 105,
    baz = 69;
  return bar;
}
`,
      output: `
function foo() {
  const 
    baz = 69;
  return 42 + 105;
}
`,
      errors: [{ messageId: 'uselessAssign' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several declarators (removing the last one)',
      code: `
function foo() {
  const baz = 69,
    bar = 42 + 105;
  return bar;
}
`,
      output: `
function foo() {
  const baz = 69
    ;
  return 42 + 105;
}
`,
      errors: [{ messageId: 'uselessAssign' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a multi-line expression and `allowMultiLine: false` #docs',
      options: [{ allowMultiLine: false }],
      code: `
function foo() {
  const bar = [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
  return bar;
}
`,
      output: `
function foo() {
  
  return [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
}
`,
      errors: [{ messageId: 'uselessAssign' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

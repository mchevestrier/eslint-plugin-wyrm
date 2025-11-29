import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-unused-param-read.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Function parameter is used and not marked as unused #docs',
      code: `
function foo(bar: string) {
  return bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function parameter is unused and marked as unused #docs',
      code: `
function foo(_bar: string) {
  return 105;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unused function parameter is written to but never read',
      code: `
function foo(_bar: string) {
  _bar = 'ok';
  return 105;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function parameter with trailing underscore is used',
      code: `
function foo(bar_: string) {
  return bar_;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Read reference with leading underscore but not a function parameter',
      code: `
const _bar = 'ok';
console.log(_bar);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Read reference to class property with leading underscore',
      code: `
class Klass {
  private _bar = 'ok';

  getBar() {
    return this._bar;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function name with leading underscore',
      code: `
function _foo() {
  return _foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Function parameter is used but marked as unused #docs',
      code: `
function foo(_bar: string) {
  return _bar;
}
`,
      errors: [{ messageId: 'noUnusedParamRead' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function parameter marked as unused and assigned to a variable',
      code: `
function foo(_bar: string) {
  const _ = _bar;
  return 105;
}
`,
      errors: [{ messageId: 'noUnusedParamRead' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
const foo = function (_bar: string) {
  return _bar;
};
`,
      errors: [{ messageId: 'noUnusedParamRead' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function expression',
      code: `
const foo = (_bar: string) => {
  return _bar;
};
`,
      errors: [{ messageId: 'noUnusedParamRead' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an object method',
      code: `
const obj = {
  foo(_bar: string) {
    return _bar;
  },
};
`,
      errors: [{ messageId: 'noUnusedParamRead' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a class method',
      code: `
class Klass {
  foo(_bar: string) {
    return _bar;
  }
}
`,
      errors: [{ messageId: 'noUnusedParamRead' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-optional-type-guard-param.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Parameter is not optional #docs',
      code: `
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parameter is not optional but uses `undefined` #docs',
      code: `
function isString(x: string | undefined): x is string {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function expression',
      code: `
const isString = (x: unknown): x is string => {
  return typeof x === 'string';
};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function expression',
      code: `
const isString = function (x: unknown): x is string {
  return typeof x === 'string';
};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function has no return type',
      code: `
function isString(x?: unknown) {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function return type is not a type predicate',
      code: `
function isString(x?: unknown): boolean {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function has an optional argument but not the one referenced in the type predicate',
      code: `
function isString(x: unknown, y?: boolean): x is string {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function returns a type predicate but the argument is missing',
      code: `
function isString(): x is string {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parameter is a binding pattern',
      code: `
function isString({ x }: { x?: unknown }): x is string {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type predicate parameter is `this` keyword',
      code: `
function isString(x?: unknown): this is string {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Parameter used in type predicate is optional #docs',
      code: `
function isString(x?: unknown): x is string {
  return typeof x === 'string';
}
`,
      errors: [{ messageId: 'optionalTypeGuardParam' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parameter used in `asserts` type predicate is optional #docs',
      code: `
function isString(x?: unknown): asserts x is string {
  if (typeof x !== 'string') throw Error('oh no');
}
`,
      errors: [{ messageId: 'optionalTypeGuardParam' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function expression',
      code: `
const isString = (x?: unknown): x is string => {
  return typeof x === 'string';
};
`,
      errors: [{ messageId: 'optionalTypeGuardParam' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function expression',
      code: `
const isString = function (x?: unknown): x is string {
  return typeof x === 'string';
};
`,
      errors: [{ messageId: 'optionalTypeGuardParam' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several arguments',
      code: `
function isString(x: unknown, y?: unknown): y is string {
  return typeof x === 'string';
}
`,
      errors: [{ messageId: 'optionalTypeGuardParam' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

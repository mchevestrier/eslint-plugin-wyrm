import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-sloppy-length-check.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`.length === 0` #docs',
      code: `
if (arr.length === 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size === 0` #docs',
      code: `
if (s.size === 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length == 0`',
      code: `
if (arr.length == 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size == 0`',
      code: `
if (s.size == 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length > 0` #docs',
      code: `
if (arr.length > 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size > 0` #docs',
      code: `
if (s.size > 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length <= 2` #docs',
      code: `
if (arr.length <= 2) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length >= 2` #docs',
      code: `
if (arr.length >= 2) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length !== 1`',
      code: `
if (arr.length !== 1) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a correct logical expression (right side `&&`)',
      code: `
if (arr.length > 0 || (0 === arr.length && Math.random())) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a correct logical expression (left side `&&`)',
      code: `
if ((Math.random() && arr.length > 0) || 0 === arr.length) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a correct logical expression (conjunction of inequalities)',
      code: `
if (arr.length !== 1 && arr.length !== 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With different objects being checked',
      code: `
if (foo.length > 0 || bar.length === 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With different properties being checked',
      code: `
if (foo.length > 0 || foo.size === 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With different objects and properties being checked',
      code: `
if (foo.length > 0 || bar.size === 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non-length property being checked',
      code: `
if (foo.bar < 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not comparing to a member expression',
      code: `
if (fooLength < 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing to a member expression with object not being an identifier',
      code: `
if ((1 ? foo : bar).length < 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing to a member expression with property not being an identifier',
      code: `
if (foo['length'] < 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non-comparison binary operator',
      code: `
if (foo.length || 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `instanceof` binary operator',
      code: `
if (foo.length instanceof Number) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `in` binary operator',
      code: `
if (0 in foo.length) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `%` binary operator',
      code: `
if (foo.length % 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a string literal',
      code: `
if ('0' > foo.length) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a unary expression but not a number literal',
      code: `
if (!0 >= foo.length) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a negation expression but not a number literal',
      code: `
if (-n !== foo.length) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression with `??`',
      code: `
if (null ?? foo.length > 0) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`.length <= 0` #docs',
      code: `
if (arr.length <= 0) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size <= 0` #docs',
      code: `
if (s.size <= 0) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'size' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`0 >= .length`',
      code: `
if (0 >= arr.length) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`0 >= .size`',
      code: `
if (0 >= s.size) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'size' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length >= 0` #docs',
      code: `
if (arr.length >= 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size >= 0`',
      code: `
if (s.size >= 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'size' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.length < 0` #docs',
      code: `
if (arr.length < 0) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing to a negative value #docs',
      code: `
if (arr.length !== -4) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing to a negative value (-1)',
      code: `
if (arr.length !== -1) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size < 0` #docs',
      code: `
if (s.size < 0) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'size' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Impossible condition (reversed)',
      code: `
if (0 > s.size) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'size' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Constant condition (reversed)',
      code: `
if (0 <= s.size) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'size' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.size > -1`',
      code: `
if (s.size > -1) {
}
`,
      errors: [
        { messageId: 'noSloppyLengthCheck', data: { property: 'size' } },
        { messageId: 'noConstantLengthCheck', data: { property: 'size' } },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a conditional expression',
      code: `
arr.length <= 0 ? 42 : 105;
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression #docs',
      code: `
if (arr.length > 0 || 0 === arr.length) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression with impossible value',
      code: `
if (arr.length > 0 && 0 == arr.length) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression with impossible value (reversed)',
      code: `
if (0 < arr.length && arr.length == 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an always false logical expression',
      code: `
if (arr.length < 1 && arr.length !== 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an always true logical expression',
      code: `
if (arr.length < 1 || arr.length !== 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an always true logical expression (weak inequality)',
      code: `
if (arr.length < 1 || arr.length != 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a redundant logical expression (inequality on the right side)',
      code: `
if (arr.length > 0 || arr.length !== 0) {
}
`,
      errors: [{ messageId: 'noRedundantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression with constant value on the left side',
      code: `
if ((arr.length > 0 || 0 === arr.length) && Math.random()) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression with constant value on the right side',
      code: `
if (Math.random() && (arr.length > 0 || 0 === arr.length)) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a constant logical expression (`< 1`)',
      code: `
if (arr.length < 1 || arr.length > 0) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a constant logical expression (right side `||`)',
      code: `
if (arr.length > 0 || 0 === arr.length || Math.random()) {
}
`,
      errors: [
        { messageId: 'noConstantLengthCheck', data: { property: 'length' } },
        { messageId: 'noConstantLengthCheck', data: { property: 'length' } },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a constant logical expression (left side `||`)',
      code: `
if (Math.random() || arr.length > 0 || 0 === arr.length) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an impossible logical expression (right side `||`)',
      code: `
if (arr.length > 0 && (0 === arr.length || Math.random())) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an impossible logical expression (left side `||`)',
      code: `
if ((Math.random() || arr.length > 0) && 0 === arr.length) {
}
`,
      errors: [{ messageId: 'noConstantLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a logical expression with `??` but an impossible comparison',
      code: `
if (null ?? foo.length < 0) {
}
`,
      errors: [{ messageId: 'noSloppyLengthCheck', data: { property: 'length' } }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

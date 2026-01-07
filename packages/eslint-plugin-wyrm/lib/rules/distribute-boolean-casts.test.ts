import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './distribute-boolean-casts.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Distributed boolean cast #docs',
      code: `
const foo = !!bar && baz.length > 2 && !!quux.description;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Logical expression at the root',
      code: `
!!bar && baz.length > 2;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parent unary expression is not a negation',
      code: `
+(bar && baz.length);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parent unary expression is not a boolean cast',
      code: `
!(bar && baz.length);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Double unary expression but not a boolean cast',
      code: `
!+(bar && baz.length);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Grandparent unary expression is not a boolean cast',
      code: `
+!(bar && baz.length);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parent call expression callee is not an identifier',
      code: `
new Function()(bar && baz.length);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Parent call expression is not a Boolean call',
      code: `
foo(bar && baz.length);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'An entire logical expression wrapped in a boolean cast #docs',
      code: `
const foo = !!(bar && baz.length > 2 && quux.description);
`,
      output: [
        `
const foo = (!!(bar && baz.length > 2) && !!(quux.description));
`,
        `
const foo = ((!!(bar) && baz.length > 2) && !!(quux.description));
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'An entire logical expression wrapped in a Boolean call',
      code: `
const foo = Boolean(bar && baz.length > 2 && quux.description);
`,
      output: [
        `
const foo = (!!(bar && baz.length > 2) && !!(quux.description));
`,
        `
const foo = ((!!(bar) && baz.length > 2) && !!(quux.description));
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing expressions are wrapped in a boolean cast',
      code: `
const foo = !!(!bar && baz.length > 2 && (quux.description ?? 'Default description'));
`,
      output: [
        `
const foo = (!!(!bar && baz.length > 2) && !!(quux.description ?? 'Default description'));
`,
        `
const foo = ((!bar && baz.length > 2) && !!(quux.description ?? 'Default description'));
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comments are preserved by the autofix',
      code: `
function foo(quux) {
  return !!(
    quux &&
    typeof quux === 'object' &&
    // Ensure POJO prototype
    Object.getPrototypeOf(quux) === Object.prototype &&
    'baz' in quux &&
    typeof quux.baz === 'string'
  );
}
`,
      output: [
        `
function foo(quux) {
  return (!!(quux &&
    typeof quux === 'object' &&
    // Ensure POJO prototype
    Object.getPrototypeOf(quux) === Object.prototype &&
    'baz' in quux) && typeof quux.baz === 'string');
}
`,
        `
function foo(quux) {
  return ((!!(quux &&
    typeof quux === 'object' &&
    // Ensure POJO prototype
    Object.getPrototypeOf(quux) === Object.prototype) && 'baz' in quux) && typeof quux.baz === 'string');
}
`,
        `
function foo(quux) {
  return (((!!(quux &&
    typeof quux === 'object') && 
// Ensure POJO prototype
Object.getPrototypeOf(quux) === Object.prototype) && 'baz' in quux) && typeof quux.baz === 'string');
}
`,
        `
function foo(quux) {
  return ((((!!(quux) && typeof quux === 'object') && 
// Ensure POJO prototype
Object.getPrototypeOf(quux) === Object.prototype) && 'baz' in quux) && typeof quux.baz === 'string');
}
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several comments',
      code: `
function foo(quux) {
  return !!(
    quux &&
    typeof quux === 'object' &&
    // Ensure POJO prototype
    // Another comment
    Object.getPrototypeOf(quux) === Object.prototype &&
    /* One block comment */
    /* Two block comment */
    'baz' in quux &&
    // TODO: migrate baz to v2
    typeof quux.baz === 'string'
  );
}
`,
      output: [
        `
function foo(quux) {
  return (!!(quux &&
    typeof quux === 'object' &&
    // Ensure POJO prototype
    // Another comment
    Object.getPrototypeOf(quux) === Object.prototype &&
    /* One block comment */
    /* Two block comment */
    'baz' in quux) && 
// TODO: migrate baz to v2
typeof quux.baz === 'string');
}
`,
        `
function foo(quux) {
  return ((!!(quux &&
    typeof quux === 'object' &&
    // Ensure POJO prototype
    // Another comment
    Object.getPrototypeOf(quux) === Object.prototype) && 
/* One block comment */
/* Two block comment */
'baz' in quux) && 
// TODO: migrate baz to v2
typeof quux.baz === 'string');
}
`,
        `
function foo(quux) {
  return (((!!(quux &&
    typeof quux === 'object') && 
// Ensure POJO prototype
// Another comment
Object.getPrototypeOf(quux) === Object.prototype) && 
/* One block comment */
/* Two block comment */
'baz' in quux) && 
// TODO: migrate baz to v2
typeof quux.baz === 'string');
}
`,
        `
function foo(quux) {
  return ((((!!(quux) && typeof quux === 'object') && 
// Ensure POJO prototype
// Another comment
Object.getPrototypeOf(quux) === Object.prototype) && 
/* One block comment */
/* Two block comment */
'baz' in quux) && 
// TODO: migrate baz to v2
typeof quux.baz === 'string');
}
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },

    {
      name: 'Unary operator is not boolean-like',
      code: `
const foo = !!(bar && +'2');
`,
      output: `
const foo = (!!(bar) && !!(+'2'));
`,
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Number literal is not boolean-like',
      code: `
const foo = !!(true && 2);
`,
      output: `
const foo = (true && !!(2));
`,
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary operator is not boolean-like',
      code: `
const foo = !!(bar && 3 + 2);
`,
      output: `
const foo = (!!(bar) && !!(3 + 2));
`,
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '== operator is boolean-like',
      code: `
const foo = !!(bar && 3 == 2);
`,
      output: [
        `
const foo = (!!(bar) && 3 == 2);
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '!== operator is boolean-like',
      code: `
const foo = !!(bar && 3 !== 2);
`,
      output: [
        `
const foo = (!!(bar) && 3 !== 2);
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '!= operator is boolean-like',
      code: `
const foo = !!(bar && 3 != 2);
`,
      output: [
        `
const foo = (!!(bar) && 3 != 2);
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Boolean literal is boolean-like',
      code: `
const foo = !!(bar && false);
`,
      output: [
        `
const foo = (!!(bar) && false);
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Boolean expression at the root',
      code: `
!!(bar && bar.length);
`,
      output: [
        `
(!!(bar) && !!(bar.length));
`,
      ],
      errors: [{ messageId: 'distributeBooleanCast' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

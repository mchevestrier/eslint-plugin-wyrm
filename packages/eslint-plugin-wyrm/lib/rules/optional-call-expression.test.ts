import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './optional-call-expression.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Optional call expression #docs',
      code: `
foo?.();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Condition with alternate branch',
      code: `
if (foo) foo();
else bar();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement test is not the identifier',
      code: `
if (42) {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement test inequality only includes the identifier',
      code: `
if (foo !== 42) {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement test equality only includes the identifier',
      code: `
if (foo === bar) {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement test is a logical expression',
      code: `
if (foo !== null && bar === 42) {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement test is a binary expression but not an equality check',
      code: `
if (foo instanceof Object) {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`typeof` inequality is not a truthiness check',
      code: `
if (typeof foo !== 'object') {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`typeof` equality is not a truthiness check',
      code: `
if (typeof foo === 'undefined') {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unary expression with inequality but not a `typeof` operator',
      code: `
if (!foo !== 'undefined') {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unary expression with equality but not a `typeof` operator',
      code: `
if (!foo === 'function') {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression but the test is not an equality check',
      code: `
foo instanceof Object ? foo() : null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression but not inside an expression statement',
      code: `
const result = foo ? foo() : null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression but with different identifiers',
      code: `
foo ? bar() : null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression but the consequent is not a call expression',
      code: `
foo ? foo : null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression with a consequent call expression but the callee is not an identifier',
      code: `
foo ? (foo + 2)() : null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `if` statement',
      code: `
if (foo) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with several statements in consequent block',
      code: `
if (foo) {
  foo();
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement contains a statement but not an expression statement',
      code: `
if (foo) {
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement contains an expression statement but not a call expression',
      code: `
if (foo) {
  42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement contains a call expression but the callee is not an identifier',
      code: `
if (foo) {
  (1 ? foo : bar)();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement but with different identifiers',
      code: `
if (foo) {
  bar();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction with truthy check and call expression',
      code: `
foo || foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction but not in an expression statement',
      code: `
const fnord = foo && foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with falsiness check and call expression',
      code: `
!foo && foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with truthiness check but not a call expression',
      code: `
foo && foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with truthiness check but callee is not an identifier',
      code: `
foo && (1 ? foo : bar)();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with truthiness check but a different callee',
      code: `
foo && bar();
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`if` statement #docs',
      code: `
if (foo) {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inline `if` statement',
      code: `
if (foo) foo();
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement (with call expression argument)',
      code: `
if (foo) foo(42);
`,
      output: `
foo?.(42);
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement (with several call expression arguments)',
      code: `
if (foo) foo(42, bar('ok' /* comment */));
`,
      output: `
foo?.(42, bar('ok' /* comment */));
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression (with several call expression arguments)',
      code: `
foo ? foo(42, bar('ok' /* comment */)) : null;
`,
      output: `
foo?.(42, bar('ok' /* comment */));
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression',
      code: `
foo ? foo() : null;
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary expression with strict null inequality',
      code: `
foo !== null ? foo() : null;
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with strict undefined inequality',
      code: `
if (foo !== undefined) {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with strict null inequality',
      code: `
if (foo !== null) {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with loose null inequality',
      code: `
if (foo != null) {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with loose undefined inequality',
      code: `
if (undefined != foo) {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with `typeof` strict equality',
      code: `
if (typeof foo === 'function') {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with `typeof` loose equality',
      code: `
if (typeof foo == 'function') {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with `typeof` inequality',
      code: `
if (typeof foo !== 'undefined') {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement with `typeof` loose inequality',
      code: `
if (typeof foo != 'undefined') {
  foo();
}
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ternary condition with alternate branch',
      code: `
foo ? foo() : bar();
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with truthiness check and call expression',
      code: `
foo && foo();
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with `typeof` loose inequality and call expression',
      code: `
typeof foo != 'undefined' && foo();
`,
      output: `
foo?.();
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with strict null inequality and call expression with arguments',
      code: `
foo !== null && foo(bar, baz);
`,
      output: `
foo?.(bar, baz);
`,
      errors: [{ messageId: 'useOptionalCallExpressionSyntax' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

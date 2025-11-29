import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-convoluted-logical-expressions.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No possible simplification #docs',
      code: `
const x = quux ? (foo ?? null) : bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with different identifiers',
      code: `
const x = quux && bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with reverse test, but alternate is not a nullish literal',
      code: `
const x = (quux ? foo : baz) && (!quux ? bar : baz);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with reverse test, but alternates are not the same',
      code: `
const x = (quux ? foo : null) && (!quux ? bar : undefined);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with reverse test, but only the first alternate is a nullish literal',
      code: `
const x = (quux ? foo : null) && (!quux ? bar : baz);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with reverse test, but only the second alternate is a nullish literal',
      code: `
const x = (quux ? foo : baz) && (!quux ? bar : null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions but the test is not an identifier',
      code: `
const x = (true ? foo : null) && (true ? bar : null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with identical nullish alternates and different test',
      code: `
const x = (quux ? foo : null) && (fnord ? bar : null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions but the right test is not negated',
      code: `
const x = (quux ? foo : null) && (+quux ? bar : null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions but the negated right test is not an identifier',
      code: `
const x = (quux ? foo : null) && (!0 ? bar : null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions but the negated identifier in the right test is not the same',
      code: `
const x = (quux ? foo : null) && (!fnord ? bar : null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions but the alternate is not nullish',
      code: `
const x = (quux ? foo : 0) && (!quux ? bar : 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with repeated identifier',
      code: `
const x = foo && (foo && bar);
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Disjunction with repeated identifier',
      code: `
const x = foo || (foo || bar);
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Disjunction with right side conjunction but no repeated identifier',
      code: `
const x = foo || (false && bar);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction with right side conjunction but not the same identifier',
      code: `
const x = foo || (quux && bar);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction of a conjunction and a disjunction',
      code: `
const x = (foo && bar) || (foo || baz);
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Disjunction of a disjunction and a conjunction',
      code: `
const x = (foo || bar) || (foo && baz);
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Disjunction of a conjunctions but not the same left side identifier',
      code: `
const x = (foo && bar) || (fnord && baz);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Tautology (disjunction) #docs',
      code: `
const x = foo || foo;
`,
      output: `
const x = foo;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Tautology (conjunction) #docs',
      code: `
const x = foo && foo;
`,
      output: `
const x = foo;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Tautology (nullish coalescing) #docs',
      code: `
const x = foo ?? foo;
`,
      output: `
const x = foo;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Absorption law: `A || (A && B) === A` #docs',
      code: `
const x = foo || (foo && bar);
`,
      output: `
const x = foo;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Absorption law: `A && (A || B) === A` #docs',
      code: `
const x = foo && (foo || bar);
`,
      output: `
const x = foo;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction with distributed conjunctions #docs',
      code: `
const x = (foo && bar) || (foo && baz);
`,
      output: `
const x = foo && (bar || baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with distributed disjunctions #docs',
      code: `
const x = (foo || bar) && (foo || baz);
`,
      output: `
const x = foo || (bar && baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction with distributed nullish coalescing',
      code: `
const x = (foo ?? bar) || (foo ?? baz);
`,
      output: `
const x = foo ?? (bar || baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with distributed nullish coalescing',
      code: `
const x = (foo ?? bar) && (foo ?? baz);
`,
      output: `
const x = foo ?? (bar && baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with distributed disjunction ',
      code: `
const x = (foo || bar) ?? (foo || baz);
`,
      output: `
const x = foo || (bar ?? baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with distributed conjunction ',
      code: `
const x = (foo && bar) ?? (foo && baz);
`,
      output: `
const x = foo && (bar ?? baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction with distributed conjunctions',
      code: `
const x = (foo && bar) && (foo && baz);
`,
      output: `
const x = foo && (bar && baz);
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'Nullish fallback to ternary condition with reverse test #docs',
      code: `
const x = (quux ? foo : null) ?? (!quux ? bar : null);
`,
      output: `
const x = quux ? (foo ?? null) : bar;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Falsy fallback to ternary condition with reverse test',
      code: `
const x = (quux ? foo : null) || (!quux ? bar : null);
`,
      output: `
const x = quux ? (foo || null) : bar;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with reverse test',
      code: `
const x = (quux ? foo : null) && (!quux ? bar : null);
`,
      output: `
const x = quux ? (foo && null) : bar;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with reverse test and undefined alternate',
      code: `
const x = (quux ? foo : undefined) && (!quux ? bar : undefined);
`,
      output: `
const x = quux ? (foo && undefined) : bar;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction of ternary conditions with identical test',
      code: `
const x = (quux ? foo : null) || (quux ? bar : null);
`,
      output: `
const x = quux ? (foo || bar) : null;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction of ternary conditions with identical test',
      code: `
const x = (quux ? foo : null) && (quux ? bar : null);
`,
      output: `
const x = quux ? (foo && bar) : null;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish fallback of ternary conditions with identical test',
      code: `
const x = (quux ? foo : null) ?? (quux ? bar : null);
`,
      output: `
const x = quux ? (foo ?? bar) : null;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction of ternary conditions with identical nullish alternates but different test',
      code: `
const x = (quux ? foo : null) || (fnord ? bar : null);
`,
      output: `
const x = quux && foo ? foo : fnord ? bar : null;
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

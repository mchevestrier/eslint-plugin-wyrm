import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-huge-useeffect.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`useEffect` block spanning 20 lines #docs',
      code: `
useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` with an identifier as argument',
      code: `
const bar = () => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
};

useEffect(bar, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function with no block body',
      code: `
useEffect(() => 'ok', []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function with no block body but spanning more lines than allowed',
      options: [{ maxNbLines: 3 }],
      code: `
useEffect(
  () =>
    37 +
    // a
    42 +
    // b
    69 +
    // c
    105,
  [],
);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` block spanning 3 lines (with `options.maxNbLines: 3`)',
      options: [{ maxNbLines: 3 }],
      code: `
useEffect(() => {
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee is not an identifier',
      code: `
(1 ? useEffect : quux)(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` with no argument',
      code: `
useEffect();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee is not `useEffect`',
      code: `
useCallback(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not an identifier',
      code: `
(1 ? React : Quux).useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
React['useEffect'](() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not `React`',
      code: `
Quux.useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not `useEffect`',
      code: `
React.useCallback(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`useEffect` block spanning 21 lines #docs',
      code: `
useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      errors: [{ messageId: 'noHugeUseEffect' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`React.useEffect` block spanning 21 lines',
      code: `
React.useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
`,
      errors: [{ messageId: 'noHugeUseEffect' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` block spanning 3 lines (with `options.maxNbLines: 2`)',
      options: [{ maxNbLines: 2 }],
      code: `
useEffect(() => {
  foo();
}, []);
`,
      errors: [{ messageId: 'noHugeUseEffect' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` block spanning 3 lines (with `options.maxNbLines: 2`), with a non empty dependency array',
      options: [{ maxNbLines: 2 }],
      code: `
useEffect(() => {
  foo();
}, [bar]);
`,
      errors: [{ messageId: 'noHugeUseEffect' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` block spanning 3 lines (with `options.maxNbLines: 2`), with no dependency array',
      options: [{ maxNbLines: 2 }],
      code: `
useEffect(() => {
  foo();
});
`,
      errors: [{ messageId: 'noHugeUseEffect' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` block spanning 3 lines (with `options.maxNbLines: 2`), with a function expression',
      options: [{ maxNbLines: 2 }],
      code: `
useEffect(function () {
  foo();
}, []);
`,
      errors: [{ messageId: 'noHugeUseEffect' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

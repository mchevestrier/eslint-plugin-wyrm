import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-jsx-statement.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'JSX element in return statement #docs',
      code: `export function MyComponent() {
  return <div />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX element in variable initialization #docs',
      code: `export function MyComponent() {
  const jsx = <div />;
  return jsx;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX fragment in return statement',
      code: `export function MyComponent() {
  return <div />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX fragment in variable initialization',
      code: `export function MyComponent() {
  const jsx = <div />;
  return jsx;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'JSX element in expression statement',
      code: `export function MyComponent() {
  <div />;
}
`,
      errors: [{ messageId: 'noJsxExpressionStatement' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX fragment in expression statement #docs',
      code: `export function MyComponent() {
  <></>;
}
`,
      errors: [{ messageId: 'noJsxExpressionStatement' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX in arrow function body',
      code: `export function MyComponent() {
  const fn = () => {
    <div />;
  };
  return fn();
}
`,
      errors: [{ messageId: 'noJsxExpressionStatement' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

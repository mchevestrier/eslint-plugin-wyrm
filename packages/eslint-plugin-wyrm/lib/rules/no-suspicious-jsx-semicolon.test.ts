import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-suspicious-jsx-semicolon.js';

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
      name: 'No suspicious semicolon or comma #docs',
      code: `export function MyComponent() {
  return <div />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Explicit lonely semicolon',
      code: `export function MyComponent() {
  return <div>{';'}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Lonely comma, but not trailing',
      code: `export function MyComponent() {
  return <div> ,</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Lonely comma, but not suspicious',
      code: `export function MyComponent() {
  return <div>,</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'A suspicious-looking semicolon #docs',
      code: `export function MyComponent() {
  return (
    <div>
      <div>With a trailing semicolon at the end of the line</div>;
    </div>
  );
}
`,
      errors: [{ messageId: 'noSuspiciousJsxSemicolon' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A suspicious-looking comma #docs',
      code: `export function MyComponent() {
  return (
    <div>
      <div>With a trailing comma at the end of the line</div>,
    </div>
  );
}
`,
      errors: [{ messageId: 'noSuspiciousJsxComma' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Lonely semicolon, but not trailing. Still somehow suspicious',
      code: `export function MyComponent() {
  return <div> ;</div>;
}
`,
      errors: [{ messageId: 'noSuspiciousJsxSemicolon' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

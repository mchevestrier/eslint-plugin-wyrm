import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-empty-jsx-expression.js';

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
      name: 'No JSX expression container',
      code: `function Foo() {
  return <div>Ok</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX expression container is not empty #docs',
      code: `function Foo({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX expression container with a comment #docs',
      code: `function Foo() {
  return (
    <div>
      {/* A comment */}
      Ok
    </div>
  );
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Empty JSX expression container #docs',
      code: `function Foo() {
  return (
    <div>
      {}
      Ok
    </div>
  );
}
`,
      errors: [{ messageId: 'noEmptyJsxExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX expression container with only a literal `null` #docs',
      code: `function Foo() {
  return <div>{null}</div>;
}
`,
      errors: [{ messageId: 'noEmptyJsxExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX expression container with only a literal `undefined` #docs',
      code: `function Foo() {
  return <div>{undefined}</div>;
}
`,
      errors: [{ messageId: 'noEmptyJsxExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX expression container with only a literal `false` #docs',
      code: `function Foo() {
  return <div>{false}</div>;
}
`,
      errors: [{ messageId: 'noEmptyJsxExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSX expression container with only a literal empty string #docs',
      code: `function Foo() {
  return <div>{''}</div>;
}
`,
      errors: [{ messageId: 'noEmptyJsxExpression' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

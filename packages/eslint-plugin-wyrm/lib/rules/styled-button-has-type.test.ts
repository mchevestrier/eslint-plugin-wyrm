import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './styled-button-has-type.js';

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
      name: '`styled.button` with `type="button"` #docs',
      code: `
export function MyComponent() {
  return <StyledButton type="button" />;
}

const StyledButton = styled.button\`\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled.button` with `type="submit"` #docs',
      code: `
export function MyComponent() {
  return <StyledButton type="submit" />;
}

const StyledButton = styled.button\`\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled.button` with `type="reset"`',
      code: `
export function MyComponent() {
  return <StyledButton type="reset" />;
}

const StyledButton = styled.button\`\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled(\'button\')` with `type="button"`',
      code: `
export function MyComponent() {
  return <StyledButton type="button" />;
}

const StyledButton = styled('button')\`\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled.div` without `type` attribute #docs',
      code: `
export function MyComponent() {
  return <StyledButton />;
}

const StyledButton = styled.div\`\`;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`styled.button` is missing a `type` attribute #docs',
      code: `
export function MyComponent() {
  return <StyledButton />;
}

const StyledButton = styled.button\`\`;
`,
      errors: [{ messageId: 'missingType' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "`styled('button')` is missing a `type` attribute #docs",
      code: `
export function MyComponent() {
  return <StyledButton />;
}

const StyledButton = styled('button')\`\`;
`,
      errors: [{ messageId: 'missingType' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled.button` with empty `type` attribute',
      code: `
export function MyComponent() {
  return <StyledButton type />;
}

const StyledButton = styled.button\`\`;
`,
      errors: [{ messageId: 'complexType' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled.button` with complex `type` attribute',
      code: `
export function MyComponent() {
  return <StyledButton type={foo} />;
}

const StyledButton = styled.button\`\`;
`,
      errors: [{ messageId: 'complexType' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`styled.button` with invalid `type` attribute #docs',
      code: `
export function MyComponent() {
  return <StyledButton type="foo" />;
}

const StyledButton = styled.button\`\`;
`,
      errors: [{ messageId: 'invalidValue' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

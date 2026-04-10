import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './styled-transient-props.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Valid JSX attribute #docs',
      code: `
const StyledDiv = styled.div<{ dangerouslySetInnerHTML: unknown }>\`
  display: block;
\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Transient prop #docs',
      code: `
const StyledDiv = styled.div<{ $notFoundOnDiv: unknown }>\`
  display: block;
\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "With styled('div')",
      code: `
const StyledDiv = styled('div')<{ $notFoundOnDiv: unknown }>\`
  display: block;
\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a styled component',
      code: `
const StyledDiv = foo<{ notFoundOnDiv: unknown }>\`
  display: block;
\`;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'No transient prop and not a valid attribute #docs',
      code: `
const StyledDiv = styled.div<{ notFoundOnDiv: unknown }>\`
  display: block;
\`;
`,
      errors: [
        {
          messageId: 'useTransientProps',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "With styled('div')",
      code: `
const StyledDiv = styled('div')<{ notFoundOnDiv: unknown }>\`
  display: block;
\`;
`,
      errors: [
        {
          messageId: 'useTransientProps',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-finally.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With `finally` #docs',
      code: `
try {
  console.log('try');
} catch {
  console.log('catch');
} finally {
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Try without catch handler',
      code: `
try {
  console.log('try');
  debugger;
} finally {
  console.log('finally');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Try block with only one statement',
      code: `
try {
  debugger;
} catch {
  console.log('catch');
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Try and catch blocks with one identical statement',
      code: `
try {
  debugger;
} catch {
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Try block with empty body',
      code: `
try {
} catch {
  console.log('catch');
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Catch block with only one statement',
      code: `
try {
  console.log('try');
  debugger;
} catch {
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Catch block with empty body',
      code: `
try {
  console.log('try');
  debugger;
} catch {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last statements do not match',
      code: `
try {
  console.log('try');
  debugger;
} catch {
  console.log('catch');
  console.error('error');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an identical statement, but not in final position',
      code: `
try {
  debugger;
  console.log('try');
} catch {
  debugger;
  console.log('catch');
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With a duplicate final statement in `try` and `catch` blocks #docs',
      code: `
try {
  console.log('try');
  debugger;
} catch {
  console.log('catch');
  debugger;
}
`,
      errors: [
        {
          messageId: 'preferFinally',
          suggestions: [
            {
              messageId: 'useFinally',
              output: `
try {
  console.log('try');
  
} catch {
  console.log('catch');
  
} finally {
  debugger;
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several identical statements',
      code: `
try {
  console.log('try');
  console.log('foo');
  debugger;
} catch {
  console.log('catch');
  console.log('foo');
  debugger;
}
`,
      errors: [
        {
          messageId: 'preferFinally',
          suggestions: [
            {
              messageId: 'useFinally',
              output: `
try {
  console.log('try');
  console.log('foo');
  
} catch {
  console.log('catch');
  console.log('foo');
  
} finally {
  debugger;
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an existing `finally` block',
      code: `
try {
  console.log('try');
  console.log('foo');
} catch {
  console.log('catch');
  console.log('foo');
} finally {
  debugger;
}
`,
      errors: [
        {
          messageId: 'preferFinally',
          suggestions: [
            {
              messageId: 'useFinally',
              output: `
try {
  console.log('try');
  
} catch {
  console.log('catch');
  
} finally {
  console.log('foo');
  debugger;
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With more indentation and an existing `finally` block',
      code: `
{
  try {
    console.log('try');
    console.log('foo');
  } catch {
    console.log('catch');
    console.log('foo');
  } finally {
    debugger;
  }
}
`,
      errors: [
        {
          messageId: 'preferFinally',
          suggestions: [
            {
              messageId: 'useFinally',
              output: `
{
  try {
    console.log('try');
    
  } catch {
    console.log('catch');
    
  } finally {
    console.log('foo');
    debugger;
  }
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With more indentation and no `finally` block',
      code: `
{
  try {
    console.log('try');
    console.log('foo');
  } catch {
    console.log('catch');
    console.log('foo');
  }
}
`,
      errors: [
        {
          messageId: 'preferFinally',
          suggestions: [
            {
              messageId: 'useFinally',
              output: `
{
  try {
    console.log('try');
    
  } catch {
    console.log('catch');
    
  } finally {
    console.log('foo');
  }
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

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
    {
      name: 'Identical final statements, but referencing identifiers declared in inner scope',
      code: `
try {
  const msg = 'try';
  console.log(msg);
} catch {
  const msg = 'catch';
  console.log(msg);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Identical final statements, but catch shadows outer scope variable',
      code: `
const msg = 'outer';
try {
  console.log('try');
  console.log(msg);
} catch {
  const msg = 'catch';
  console.log(msg);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Identical final statements, but try shadows outer scope variable',
      code: `
const msg = 'outer';
try {
  const msg = 'try';
  console.log(msg);
} catch {
  console.log('catch');
  console.log(msg);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.catch()` method call, but no identical final statements',
      code: `
{
  await foo
    .then(() => {
      console.log('foo');
      console.log('try');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Identical final statements, but referencing identifiers declared in try scope',
      code: `
try {
  const msg = 'try';
  console.log('try');
  console.log(msg);
} catch {
  console.log('catch');
  console.log(msg);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.catch()` method call with non-function handler',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(errorHandler);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.then()` method call with non-function block',
      code: `
{
  await foo.then(successHandler).catch(() => {
    console.log('catch');
    console.log('foo');
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.catch()` call with no handler argument',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
    })
    .catch();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.then()` call with no block argument',
      code: `
{
  await foo.then().catch(() => {
    console.log('catch');
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.catch()` handler with non-block body',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => console.log('catch'));
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.then()` block with non-block body',
      code: `
{
  await foo
    .then(() => console.log('try'))
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.catch()` call with empty handler',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {});
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.then()` call with empty block',
      code: `
{
  await foo
    .then(() => {})
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.catch()` call with single statement handler',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `.then()` call with single statement block',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function expression in .catch() with single statement',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(function () {
      console.log('catch');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function expression in .then() with single statement',
      code: `
{
  await foo
    .then(function () {
      console.log('try');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With .then() having 1 statement and .catch() having 1 identical statement',
      code: `
{
  await foo
    .then(() => {
      console.log('foo');
    })
    .catch(() => {
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With .then() having 2 statements ending with same and .catch() having 1 statement',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With .then() having 1 statement and .catch() having 2 statements ending with same',
      code: `
{
  await foo
    .then(() => {
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-member expression callee',
      code: `
{
  await foo(() => {
    console.log('try');
    console.log('foo');
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-call expression object',
      code: `
{
  await foo.catch(() => {
    console.log('catch');
    console.log('foo');
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-member expression in nested callee',
      code: `
{
  await foo().catch(() => {
    console.log('catch');
    console.log('foo');
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-identifier catch property',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    ['catch'](() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-identifier then property',
      code: `
{
  await foo['then'](() => {
    console.log('try');
    console.log('foo');
  }).catch(() => {
    console.log('catch');
    console.log('foo');
  });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-catch method name',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .then(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-then method name',
      code: `
{
  await foo
    .map(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function expression in .then()',
      code: `
{
  await foo
    .then(function () {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('bar');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function expression in .catch()',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(function () {
      console.log('catch');
      console.log('bar');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function expression in .catch() and scope reference in last statement',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(function () {
      const msg = 'catch';
      console.log(msg);
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function expression in .then() and scope reference in last statement',
      code: `
{
  await foo
    .then(function () {
      const msg = 'try';
      console.log(msg);
    })
    .catch(() => {
      console.log('catch');
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With .catch() shadowing outer scope variable',
      code: `
{
  const msg = 'outer';
  await foo
    .then(() => {
      console.log('try');
      console.log(msg);
    })
    .catch(() => {
      const msg = 'catch';
      console.log(msg);
    });
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With .then() shadowing outer scope variable',
      code: `
{
  const msg = 'outer';
  await foo
    .then(() => {
      const msg = 'try';
      console.log(msg);
    })
    .catch(() => {
      console.log('catch');
      console.log(msg);
    });
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
    {
      name: 'Identical final statements, referencing identifiers declared in outer scope',
      code: `
const msg = 'fnord';

try {
  console.log('try');
  console.log(msg);
} catch {
  console.log('catch');
  console.log(msg);
}
`,
      errors: [
        {
          messageId: 'preferFinally',
          suggestions: [
            {
              messageId: 'useFinally',
              output: `
const msg = 'fnord';

try {
  console.log('try');
  
} catch {
  console.log('catch');
  
} finally {
  console.log(msg);
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
      name: 'With a `.catch()` method call',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    });
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
      name: 'With a `.catch()` method call with multiple statements, only last one matches',
      code: `
{
  await foo
    .then(() => {
      console.log('try1');
      console.log('try2');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch1');
      console.log('catch2');
      console.log('foo');
    });
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
  await foo
    .then(() => {
      console.log('try1');
      console.log('try2');
      
    })
    .catch(() => {
      console.log('catch1');
      console.log('catch2');
      
    }).finally(() => {
      console.log('foo');
    });
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
      name: 'With a `.catch()` method call with an existing `.finally()`',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    .finally(() => {
      console.log('finally');
    });
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    })
    .finally(() => {
      console.log('foo');
      console.log('finally');
    });
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
      name: 'With a `.catch()` method call with an existing `.finally()` with non-function finalizer',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    .finally(finalizeHandler);
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    })
    .finally(finalizeHandler);
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
      name: 'With a `.catch()` method call chained with computed property .finally',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    ['finally'](() => {
      console.log('finally');
    });
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    })
    ['finally'](() => {
      console.log('finally');
    });
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
      name: 'With a `.catch()` method call chained with a non-finally method',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    .then(() => {
      console.log('next');
    });
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    })
    .then(() => {
      console.log('next');
    });
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
      name: 'With a `.catch()` method call chained with .finally() with no arguments',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    .finally();
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    })
    .finally();
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
      name: 'With a `.catch()` method call chained with .finally() with expression body',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    .finally(() => console.log('finally'));
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    })
    .finally(() => console.log('finally'));
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
      name: 'With a `.catch()` method call with .finally property access but no call',
      code: `
{
  const handler = foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    }).finally;
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
  const handler = foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    }).finally;
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
      name: 'With function expression in .then() and duplicate statements',
      code: `
{
  await foo
    .then(function () {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    });
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
  await foo
    .then(function () {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    });
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
      name: 'With function expression in .catch() and duplicate statements',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(function () {
      console.log('catch');
      console.log('foo');
    });
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(function () {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    });
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
      name: 'With function expression in both .then() and .catch() and duplicate statements',
      code: `
{
  await foo
    .then(function () {
      console.log('try');
      console.log('foo');
    })
    .catch(function () {
      console.log('catch');
      console.log('foo');
    });
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
  await foo
    .then(function () {
      console.log('try');
      
    })
    .catch(function () {
      console.log('catch');
      
    }).finally(() => {
      console.log('foo');
    });
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
      name: 'With function expression in .finally() and duplicate statements',
      code: `
{
  await foo
    .then(() => {
      console.log('try');
      console.log('foo');
    })
    .catch(() => {
      console.log('catch');
      console.log('foo');
    })
    .finally(function () {
      console.log('finally');
    });
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
  await foo
    .then(() => {
      console.log('try');
      
    })
    .catch(() => {
      console.log('catch');
      
    })
    .finally(function () {
      console.log('foo');
      console.log('finally');
    });
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

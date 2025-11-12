import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-catch-method.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Correct usage of `Promise.prototype.catch()` #docs',
      code: `let result = await getStuff().catch((err: unknown) => {
  console.error(err);
  return null;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`try` block with no async operation #docs',
      code: `let result;
try {
  result = JSON.stringify('{}');
} catch (err) {
  console.error(err);
  result = null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`try` block with no `catch` handler',
      code: `let result;
try {
  result = await getStuff();
} finally {
  console.log('done');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`catch` block has a `return` statement',
      code: `let result;
try {
  result = await getStuff();
} catch {
  result = null;
  return result;
}

console.log(result);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`finally` block has a `return` statement',
      code: `let result;
try {
  result = await getStuff();
} catch {
  result = null;
} finally {
  return result;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment in `try` block is not to an identifier',
      code: `let result;
try {
  ({ result }) = await getStuff();
} catch {
  result = null;
}

console.log(result);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Several assignment in `try` block with an `await` expression as initializer',
      code: `let result;
let foo;
try {
  result = await getStuff();
  foo = await getMoreStuff();
} catch {
  result = null;
}

console.log(result);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The variable is used after being declared so we do not touch it',
      code: `let result = 42;
console.log(result);

console.log('Fetching stuff');
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
console.log(result);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`try` block has no assignment',
      code: `let result;
try {
  await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`result` variable is not in scope',
      code: `try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`result` variable is an import',
      code: `import { result } from './foo';
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`result` variable is declared in the outer scope',
      code: `let result;
function foo() {
  try {
    result = await getStuff();
  } catch (err) {
    console.error(err);
    result = null;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`result` variable is const',
      code: `const result = undefined;
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Conditional assignment based on asynchronous result #docs',
      code: `let result;
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getStuff()
  .catch((err: unknown) => {
    console.error(err);
    return null;
  });
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
      name: 'With several assignments in `catch` block',
      code: `let result;
console.log('Fetching stuff');
let msg = '';
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
  msg = err.message;
}
console.log(result);
if (msg) console.log(msg);
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
console.log('Fetching stuff');
let msg = '';
let result = await getStuff()
  .catch((err: unknown) => {
    console.error(err);
    msg = err.message;
    return null;
  });
console.log(result);
if (msg) console.log(msg);
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
      name: '`try` block has several `await` statements',
      code: `let result;
try {
  result = await getStuff();
  await sendMoreStuff();
} catch {
  result = null;
}

console.log(result);
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getStuff()
  .then((val0) => {
    await sendMoreStuff();
    return val0;
  })
  .catch(() => {
    return null;
  });

console.log(result);
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
      name: 'With multiple statements in block',
      code: `let result;
console.log('Fetching stuff');
try {
  result = await getStuff();
  console.log('Ok!');
} catch (err) {
  console.error(err);
  result = null;
}
console.log(result);
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
console.log('Fetching stuff');
let result = await getStuff()
  .then((val0) => {
    console.log('Ok!');
    return val0;
  })
  .catch((err: unknown) => {
    console.error(err);
    return null;
  });
console.log(result);
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
      name: 'With multiple conditional assignments',
      code: `let result;
console.log('Fetching stuff');
let msg = '';
try {
  result = await getStuff();
  msg = 'Ok!';
} catch (err) {
  console.error(err);
  result = null;
  msg = err.message;
}
console.log(result);
if (msg) console.log(msg);
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
console.log('Fetching stuff');
let msg = '';
let result = await getStuff()
  .then((val0) => {
    msg = 'Ok!';
    return val0;
  })
  .catch((err: unknown) => {
    console.error(err);
    msg = err.message;
    return null;
  });
console.log(result);
if (msg) console.log(msg);
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
      name: 'Error parameter has a type',
      code: `let result;
try {
  result = await getStuff();
} catch (err: Error) {
  result = null;
}
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getStuff()
  .catch((err: Error) => {
    return null;
  });
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
      name: 'No error parameter',
      code: `let result;
try {
  result = await getStuff();
} catch {
  result = null;
}
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getStuff()
  .catch(() => {
    return null;
  });
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
      name: 'Error parameter is destructured',
      code: `let result;
try {
  result = await getStuff();
} catch ({ message }: Error) {
  result = message;
}
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getStuff()
  .catch(({ message }: Error) => {
    return message;
  });
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
      name: 'Result parameter name should not conflict with existing scope',
      code: `let result;
let val0 = 42;
try {
  result = await getStuff();
  let val1 = 105;
  console.log(val0);
} catch (err: Error) {
  result = null;
}
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let val0 = 42;
let result = await getStuff()
  .then((val2) => {
    let val1 = 105;
    console.log(val0);
    return val2;
  })
  .catch((err: Error) => {
    return null;
  });
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
      name: 'Without reassignment in `catch` block',
      code: `let result = 42;
try {
  result = await getFoo();
} catch (error) {
  console.error(error);
}
console.log(result);
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getFoo()
  .catch((error: unknown) => {
    console.error(error);
    return 42;
  });
console.log(result);
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
      name: 'With implicit undefined assignment',
      code: `let result;
try {
  result = await getFoo();
} catch (error) {
  console.error(error);
}
console.log(result);
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `
let result = await getFoo()
  .catch((error: unknown) => {
    console.error(error);
    return undefined;
  });
console.log(result);
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
      name: 'With several inline declarations',
      code: `let foo, result, bar;
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
foo = 'ok';
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `let foo , bar;
let result = await getStuff()
  .catch((err: unknown) => {
    console.error(err);
    return null;
  });
foo = 'ok';
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
      name: 'With several inline declarations (`result` is first)',
      code: `let result, foo, bar;
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
foo = 'ok';
`,
      errors: [
        {
          messageId: 'preferCatchMethod',
          suggestions: [
            {
              messageId: 'useCatchMethod',
              output: `let  foo, bar;
let result = await getStuff()
  .catch((err: unknown) => {
    console.error(err);
    return null;
  });
foo = 'ok';
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

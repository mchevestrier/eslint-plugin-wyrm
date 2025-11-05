import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-catch-method.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Correct usage of `Promise.prototype.catch()` #docs',
      code: `let result = await getStuff()
  .catch((err: unknown) => {
    console.error(err);
    return null;
  });
`,
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
  ],
});

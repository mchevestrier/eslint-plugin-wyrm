import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-usememo.js';

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
      name: 'Useful `useMemo()`: with dependencies #docs',
      code: `
function MyComponent() {
  const [baz, setBaz] = useState(42);
  const foo = useMemo(() => baz * 2, [baz]);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful `useMemo()`: doing actual work #docs',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => factorial(20), []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful `useMemo()`: doing actual work (declaration first)',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    const result = factorial(20);
    return result;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful `useMemo()`: doing actual work (assignment first)',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    let result;
    result = factorial(20);
    return result;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Actual work in if statement',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    if (1) {
      return factorial(20);
    }
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Actual work in logical expression',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return 0 && factorial(20);
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Actual work in binary expression',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return 0 + factorial(20);
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Possibly actual work with exponentiation operator',
      code: `
import { baz } from './baz';

function MyComponent() {
  const foo = useMemo(() => {
    return baz ** 20;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Actual work in array expression',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return [, factorial(20)];
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Actual work in consequent branch only',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    if (1) {
      return factorial(20);
    } else {
      return 42;
    }
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Actual work in alternate branch only',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    if (1) {
      return 42;
    } else {
      return factorial(20);
    }
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No callback argument',
      code: `
function MyComponent() {
  const foo = useMemo();

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callback argument is not a function expression',
      code: `
import { callback } from './callback';

function MyComponent() {
  const foo = useMemo(callback, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect` hook',
      code: `
function MyComponent() {
  let foo = null;

  useEffect(() => {
    foo = 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not calling an identifier or member expression',
      code: `
function MyComponent() {
  let foo = null;

  (() => {
    foo = 42;
  })();

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling a member expression, but object is not an identifier',
      code: `
function MyComponent() {
  (1 ? React : Quux).useMemo(() => {
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling a member expression on `React`, but method is not an identifier',
      code: `
function MyComponent() {
  React['useMemo'](() => {
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling a member expression, but object is not `React`',
      code: `
function MyComponent() {
  const foo = Quux.useMemo(() => {
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling a member expression on `React`, but method is not `useMemo`',
      code: `
function MyComponent() {
  React.useEffect(() => {
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning JSX',
      code: `
function MyComponent() {
  const foo = useMemo(() => <div />, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread element with call expression',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => [...factorial(20)], []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object expression with call expression',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return {
      quux: factorial(20),
    };
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object expression with call expression in property key',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return {
      [factorial(20)]: 'quux',
    };
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Everything exotic is considered as actual work by default',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    with ({}) {
      // Do nothing
    }
    return;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'For loop is actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    for (let i = 0; i < 10; i++) {
      // Do nothing
    }
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'For-in loop is actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    for (const key in obj) {
      // Do nothing
    }
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'For-of loop is actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    for (const item of items) {
      // Do nothing
    }
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'While loop is actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    while (true) {
      break;
    }
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Do-while loop is actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    do {
      break;
    } while (true);
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Await expression is actual work',
      code: `
async function MyComponent() {
  const foo = useMemo(async () => {
    await Promise.resolve(42);
    return 42;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Await in return is actual work',
      code: `
async function MyComponent() {
  const foo = useMemo(async () => await Promise.resolve(42), []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple statements with first statement doing actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    factorial(20);
    const x = 42;
    return x;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple statements with second statement doing actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    const x = 42;
    factorial(20);
    return x;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with first element doing actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => [factorial(20), 1, 2], []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with middle element doing actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => [1, factorial(20), 2], []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with last element doing actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => [1, 2, factorial(20)], []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object with computed property key doing actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return {
      [factorial(20)]: 'value',
      normalKey: 42,
    };
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object with first property value doing actual work (non-return parent)',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    const obj = { quux: factorial(20), bar: 42 };
    return [obj];
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object with second property value doing actual work (non-return parent)',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    const obj = { bar: 42, quux: factorial(20) };
    return [obj];
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No dependency array',
      code: `
function MyComponent() {
  const foo = useMemo(() => 42);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Dependency array is not an array literal',
      code: `
const deps = [];

function MyComponent() {
  const foo = useMemo(() => 42, deps);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object literal (inline return)',
      code: `
function MyComponent() {
  const foo = useMemo(() => ({ quux: 42 }), []);

  return <Fnord value={foo} />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an object literal expression #docs',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    return {
      quux: 20,
    };
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several returned object literal expressions',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    if (quux > 42) {
      return { quux: 20 };
    }
    return { quux: 37 };
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block with mixed actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    if (condition) {
      factorial(20);
      const x = 42;
    }
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Variable declarations with mixed actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    const a = factorial(20),
      b = 42;
    return a;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unreachable code after return',
      code: `
function MyComponent() {
  const bar = 42;
  const foo = useMemo(() => {
    return bar;
    // unreachable
    console.log('test');
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Computed property key with actual work',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    const obj = { [factorial(20)]: 42 };
    return obj;
  }, []);

  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Useless `useMemo()` #docs',
      code: `
function MyComponent() {
  const foo = useMemo(() => 42, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless `useMemo()`: just returning an identifier #docs',
      code: `
function MyComponent() {
  const [baz, setBaz] = useState(42);
  const foo = useMemo(() => baz, [baz]);

  return foo;
}
`,
      errors: [{ messageId: 'noSingleReturnedIdentifier' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple statements ending with returning an identifier should NOT trigger noSingleReturnedIdentifier',
      code: `
function MyComponent() {
  const bar = 42;
  const foo = useMemo(() => {
    const x = 1;
    return bar;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },

    {
      name: 'Useless `useMemo()`: with a function expression',
      code: `
function MyComponent() {
  const foo = useMemo(function () {
    return 42;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless `useMemo()`: with return statement',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    return 42;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless `React.useMemo()`',
      code: `
function MyComponent() {
  const foo = React.useMemo(() => 42, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty body',
      code: `
function MyComponent() {
  const foo = useMemo(() => {}, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Body with only an empty return',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    return;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning a `satisfies` expression',
      code: `
function MyComponent() {
  const foo = useMemo(() => 42 satisfies number, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning an `as` expression',
      code: `
function MyComponent() {
  const foo = useMemo(() => 42 as number, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning a non null expression',
      code: `
function MyComponent() {
  const foo = useMemo(() => 42!, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `return` statement',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    if (1) return;
    return 42;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `yield` statement',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    yield;
    return 42;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Logical expression with no actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    return bar && baz;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression with no actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    return bar + baz;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'If statement with no actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    if (1) {
      return 42;
    }
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a spread element',
      code: `
function MyComponent() {
  const foo = useMemo(() => [...[20]], []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With object expression in condition test',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    if ({ fnord: 42 }.fnord > 42) {
      return 105;
    }
    return 37;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning identifier with empty deps array',
      code: `
function MyComponent() {
  const bar = 42;
  const foo = useMemo(() => bar, []);

  return foo;
}
`,
      errors: [{ messageId: 'noSingleReturnedIdentifier' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning identifier in block statement with empty deps',
      code: `
function MyComponent() {
  const bar = 42;
  const foo = useMemo(() => {
    return bar;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noSingleReturnedIdentifier' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Member expression is not actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => obj.property, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Member expression in return is not actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    return obj.property;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with only literals and identifiers is not actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => [1, 2, bar], []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty array is not actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => [], []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Variable declaration without initializer is not actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    let bar;
    return 42;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple statements but no actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    const a = 1;
    const b = 2;
    return a + b;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Expression statement with identifier',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    bar;
    return 42;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple statements but only last has no actual work',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    const a = 1;
    const b = 2;
    const c = 3;
    return a + b + c;
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with multiple non-actual-work elements',
      code: `
function MyComponent() {
  const foo = useMemo(() => [bar, baz, quux], []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object with multiple properties, none doing actual work (non-return parent)',
      code: `
function MyComponent() {
  const foo = useMemo(() => {
    const obj = { bar: 42, baz: 37, quux: x };
    return [obj];
  }, []);

  return foo;
}
`,
      errors: [{ messageId: 'noUselessUseMemo' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

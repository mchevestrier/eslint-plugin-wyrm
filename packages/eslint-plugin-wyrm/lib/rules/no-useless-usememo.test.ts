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
      name: 'Useful `useMemo()` - with dependencies #docs',
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
      name: 'Useful `useMemo()` - doing actual work #docs',
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
      name: 'Useful `useMemo()` - doing actual work (declaration first)',
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
      name: 'Useful `useMemo()` - doing actual work (assignment first)',
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
      name: 'Useless `useMemo()` (with a function expression)',
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
      name: 'Useless `useMemo()` (with return statement)',
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
      name: 'If statement with no actual work',
      code: `
import { factorial } from './factorial';

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
import { factorial } from './factorial';

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
      name: 'With an object expression',
      code: `
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => {
    return {
      quux: 20,
    };
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

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './slim-try.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Simple literal assignment outside `try` block #docs',
      code: `
const url = '/foo';
try {
  await fetch(url);
} catch (err) {
  console.error(err);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty try block',
      code: `
try {
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe statement: await expression',
      code: `
try {
  await fetch(url);
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe statement: call expression',
      code: `
try {
  doSomething();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe statement: member expression',
      code: `
try {
  obj.prop;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: export declaration',
      code: `
try {
  export const x = 1;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: throw statement',
      code: `
try {
  throw new Error();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: nested try statement',
      code: `
try {
  try {
    doSomething();
  } catch {}
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: import declaration',
      code: `
try {
  import { x } from 'module';
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: return with unsafe expression',
      code: `
function foo() {
  try {
    return doUnsafe();
  } catch (err) {}
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: BlockStatement with unsafe statement',
      code: `
try {
  {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: DoWhile with unsafe body',
      code: `
try {
  do {
    doUnsafe();
  } while (false);
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: While with unsafe test',
      code: `
try {
  while (doUnsafe()) {}
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: While with unsafe body',
      code: `
try {
  while (true) {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ForIn with unsafe right',
      code: `
try {
  for (const key in doUnsafe()) {
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ForIn with unsafe body',
      code: `
try {
  for (const key in obj) {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ForOf with unsafe right',
      code: `
try {
  for (const item of doUnsafe()) {
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ForOf with unsafe body',
      code: `
try {
  for (const item of arr) {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: For with unsafe init',
      code: `
try {
  for (let i = doUnsafe(); i < 10; i++) {}
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: For with unsafe test',
      code: `
try {
  for (let i = 0; doUnsafe(); i++) {}
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: For with unsafe update',
      code: `
try {
  for (let i = 0; i < 10; doUnsafe()) {}
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: For with unsafe body',
      code: `
try {
  for (let i = 0; i < 10; i++) {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: Labeled statement with unsafe body',
      code: `
try {
  label: doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: If with both branches unsafe',
      code: `
try {
  if (cond) {
    doUnsafe();
  } else {
    alsoUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: Switch with unsafe discriminant',
      code: `
try {
  switch (doUnsafe()) {
    case 1:
      break;
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: Switch with unsafe case test',
      code: `
try {
  switch (foo) {
    case doUnsafe():
      break;
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: Switch with unsafe case consequent',
      code: `
try {
  switch (x) {
    case 1:
      doUnsafe();
      break;

    case 2:
      'safe';
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: With statement with unsafe object',
      code: `
try {
  with (doUnsafe()) {
    const x = 1;
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: With statement with unsafe body',
      code: `
try {
  with (obj) {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ArrayExpression with unsafe element',
      code: `
try {
  const arr = [42, doUnsafe()];
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ArrayExpression with unsafe spread',
      code: `
try {
  const arr = [42, ...safe, ...doUnsafe()];
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: AssignmentExpression with unsafe right',
      code: `
let x;
try {
  x = doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: BinaryExpression with unsafe left',
      code: `
try {
  const result = doUnsafe() + 1;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: BinaryExpression with unsafe right',
      code: `
try {
  const result = 1 + doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ConditionalExpression with unsafe test',
      code: `
try {
  const x = doUnsafe() ? 1 : 2;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ConditionalExpression with unsafe consequent',
      code: `
try {
  const x = true ? doUnsafe() : 2;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ConditionalExpression with unsafe alternate',
      code: `
try {
  const x = true ? 1 : doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ImportExpression',
      code: `
try {
  const mod = import('./module');
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: LogicalExpression with unsafe left',
      code: `
try {
  const x = doUnsafe() && false;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: LogicalExpression with unsafe right',
      code: `
try {
  const x = true && doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ObjectExpression with unsafe key',
      code: `
try {
  const obj = { [doUnsafe()]: 1 };
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ObjectExpression with unsafe value',
      code: `
try {
  const obj = { a: doUnsafe() };
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ObjectExpression with unsafe spread',
      code: `
try {
  const obj = { ...doUnsafe() };
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: SequenceExpression with unsafe expression',
      code: `
try {
  const x = (1, doUnsafe(), 3);
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: TaggedTemplateExpression',
      code: `
try {
  const x = tag\`template\`;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: TemplateLiteral with some unsafe expression',
      code: `
try {
  const x = \`hello \${doUnsafe()} \${42}\`;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: TSAsExpression with unsafe expression',
      code: `
try {
  const x = doUnsafe() as number;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: TSNonNullExpression with unsafe expression',
      code: `
try {
  const y = doUnsafe()!;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: TSSatisfiesExpression with unsafe expression',
      code: `
try {
  const x = doUnsafe() satisfies number;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: TSTypeAssertion with unsafe expression',
      code: `
try {
  const x = <number>doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: UnaryExpression with unsafe argument',
      code: `
try {
  const x = -doUnsafe();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: UpdateExpression with member expression',
      code: `
const obj = { x: 1 };
try {
  obj.x++;
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: YieldExpression with unsafe argument',
      code: `
function* gen() {
  try {
    yield doUnsafe();
  } catch (err) {}
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: Super expression',
      code: `
class Foo extends Bar {
  constructor() {
    try {
      super();
    } catch (err) {}
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: NewExpression',
      code: `
try {
  const x = new Foo();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ExportAllDeclaration',
      code: `
try {
  export * from './module';
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ExportDefaultDeclaration',
      code: `
try {
  export default function foo() {}
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ArrayPattern',
      code: `
try {
  const [x = foo(), y = 5] = [];
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: SpreadElement in ArrayExpression',
      code: `
try {
  const [x] = [...foo()];
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: RestElement in ArrayPattern',
      code: `
try {
  const [...[x = foo()]] = [];
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ObjectPattern',
      code: `
try {
  const { x = foo(), y = 42 } = {};
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: SpreadElement in ObjectExpression',
      code: `
try {
  const { x } = { ...foo() };
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: computed key in ObjectPattern',
      code: `
try {
  const { [foo()]: x } = {};
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: AssignmentPattern with unsafe ObjectExpression in left side',
      code: `
try {
  const { x = { y: foo() } } = {};
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: optional call expression',
      code: `
try {
  foo?.();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: ChainExpression',
      code: `
try {
  const x = obj?.prop;
  doSomething();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several variable declarators',
      code: `
try {
  const x = 42,
    y = foo();
  doSomething();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an if statement with unsafe consequent',
      code: `
try {
  if (foo) {
    doUnsafe();
  }
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'If statement with unsafe consequent and safe alternate',
      code: `
try {
  if (cond) {
    doUnsafe();
  } else {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'If statement with safe consequent and unsafe alternate',
      code: `
try {
  if (cond) {
    const x = 1;
  } else {
    doUnsafe();
  }
  doSomething();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an index access',
      code: `
try {
  foo[0];
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: BinaryExpression with PrivateIdentifier',
      code: `
class Foo {
  #x = 1;
  test() {
    const obj = {};
    try {
      const result = #x in obj;
      doSomething();
    } catch (err) {}
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unsafe: BinaryExpression with instanceof',
      code: `
const x = 1;
const obj = null;
try {
  const result = x instanceof obj;
  doSomething();
} catch (err) {}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Simple literal assignment inside `try` block #docs',
      code: `
try {
  const url = '/foo';
  await fetch(url);
} catch (err) {
  console.error(err);
}
`,
      output: `
const url = '/foo';
try {
  
  await fetch(url);
} catch (err) {
  console.error(err);
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Break statement',
      code: `
while (true) {
  try {
    break;
    doSomething();
  } catch (err) {}
}
`,
      output: `
while (true) {
  break;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Continue statement',
      code: `
while (true) {
  try {
    continue;
    doSomething();
  } catch (err) {}
}
`,
      output: `
while (true) {
  continue;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Debugger statement',
      code: `
try {
  debugger;
  doSomething();
} catch (err) {}
`,
      output: `
debugger;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty statement',
      code: `
try {
  ;
  doSomething();
} catch (err) {}
`,
      output: `
;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'Class declaration',
      code: `
try {
  class Foo {}
  doSomething();
} catch (err) {}
`,
      output: `
class Foo {}
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function declaration',
      code: `
try {
  function foo() {}
  doSomething();
} catch (err) {}
`,
      output: `
function foo() {}
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'BlockStatement with safe statements',
      code: `
try {
  {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
{
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return statement without argument',
      code: `
function foo() {
  try {
    return;
    doSomething();
  } catch (err) {}
}
`,
      output: `
function foo() {
  return;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return statement with safe expression',
      code: `
function foo() {
  try {
    return 42;
    doSomething();
  } catch (err) {}
}
`,
      output: `
function foo() {
  return 42;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'While loop with safe test and body',
      code: `
try {
  while (true) {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
while (true) {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'DoWhile statement with safe body',
      code: `
try {
  do {
    const x = 1;
  } while (false);
  doSomething();
} catch (err) {}
`,
      output: `
do {
    const x = 1;
  } while (false);
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'ForIn statement with safe initializer, right, and body',
      code: `
try {
  for (const key in obj) {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
for (const key in obj) {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'ForOf statement with safe initializer, right, and body',
      code: `
try {
  for (const item of arr) {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
for (const item of arr) {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'For statement with all parts safe',
      code: `
try {
  for (let i = 0; i < 10; i++) {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
for (let i = 0; i < 10; i++) {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Labeled statement with safe body',
      code: `
try {
  label: {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
label: {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'If statement with safe consequent',
      code: `
try {
  if (true) {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
if (true) {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Switch statement with safe cases',
      code: `
try {
  switch (x) {
    case 1:
      const y = 1;
      break;
  }
  doSomething();
} catch (err) {}
`,
      output: `
switch (x) {
    case 1:
      const y = 1;
      break;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With statement (safe object and body)',
      code: `
try {
  with (obj) {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
with (obj) {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ArrayExpression with literals',
      code: `
try {
  const arr = [1, 2, 3];
  doSomething();
} catch (err) {}
`,
      output: `
const arr = [1, 2, 3];
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ArrayExpression with safe spread',
      code: `
const x = [1, 2];
try {
  const arr = [...x];
  doSomething();
} catch (err) {}
`,
      output: `
const x = [1, 2];
const arr = [...x];
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: AssignmentExpression with safe values',
      code: `
let x;
try {
  x = 42;
  doSomething();
} catch (err) {}
`,
      output: `
let x;
x = 42;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: BinaryExpression with safe operands',
      code: `
try {
  const result = 1 + 2;
  doSomething();
} catch (err) {}
`,
      output: `
const result = 1 + 2;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ConditionalExpression with safe parts',
      code: `
try {
  const x = true ? 1 : 2;
  doSomething();
} catch (err) {}
`,
      output: `
const x = true ? 1 : 2;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: FunctionExpression',
      code: `
try {
  const fn = function () {};
  doSomething();
} catch (err) {}
`,
      output: `
const fn = function () {};
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: Identifier',
      code: `
const x = 1;
try {
  const y = x;
  doSomething();
} catch (err) {}
`,
      output: `
const x = 1;
const y = x;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: Literal',
      code: `
try {
  const x = 42;
  doSomething();
} catch (err) {}
`,
      output: `
const x = 42;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: LogicalExpression with safe operands',
      code: `
try {
  const x = true && false;
  doSomething();
} catch (err) {}
`,
      output: `
const x = true && false;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: MetaProperty',
      code: `
function foo() {
  try {
    const x = new.target;
    doSomething();
  } catch (err) {}
}
`,
      output: `
function foo() {
  const x = new.target;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ObjectExpression with safe properties',
      code: `
try {
  const obj = { a: 1, b: 2 };
  doSomething();
} catch (err) {}
`,
      output: `
const obj = { a: 1, b: 2 };
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ObjectExpression with safe spread',
      code: `
const x = { a: 1 };
try {
  const obj = { ...x, b: 2 };
  doSomething();
} catch (err) {}
`,
      output: `
const x = { a: 1 };
const obj = { ...x, b: 2 };
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: SequenceExpression with safe expressions',
      code: `
try {
  const x = (1, 2, 3);
  doSomething();
} catch (err) {}
`,
      output: `
const x = (1, 2, 3);
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TemplateLiteral with safe expressions',
      code: `
try {
  const x = \`hello \${1}\`;
  doSomething();
} catch (err) {}
`,
      output: `
const x = \`hello \${1}\`;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ThisExpression',
      code: `
class Foo {
  bar() {
    try {
      const x = this;
      doSomething();
    } catch (err) {}
  }
}
`,
      output: `
class Foo {
  bar() {
    const x = this;
try {
      
      doSomething();
    } catch (err) {}
  }
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSAsExpression',
      code: `
try {
  const x = 1 as number;
  doSomething();
} catch (err) {}
`,
      output: `
const x = 1 as number;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSNonNullExpression',
      code: `
const x = 1;
try {
  const y = x!;
  doSomething();
} catch (err) {}
`,
      output: `
const x = 1;
const y = x!;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSSatisfiesExpression',
      code: `
try {
  const x = 1 satisfies number;
  doSomething();
} catch (err) {}
`,
      output: `
const x = 1 satisfies number;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSTypeAssertion',
      code: `
try {
  const x = <number>1;
  doSomething();
} catch (err) {}
`,
      output: `
const x = <number>1;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: UnaryExpression',
      code: `
try {
  const x = -1;
  doSomething();
} catch (err) {}
`,
      output: `
const x = -1;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: UpdateExpression',
      code: `
let x = 1;
try {
  x++;
  doSomething();
} catch (err) {}
`,
      output: `
let x = 1;
x++;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: YieldExpression without argument',
      code: `
function* gen() {
  try {
    yield;
    doSomething();
  } catch (err) {}
}
`,
      output: `
function* gen() {
  yield;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: YieldExpression with safe argument',
      code: `
function* gen() {
  try {
    yield 1;
    doSomething();
  } catch (err) {}
}
`,
      output: `
function* gen() {
  yield 1;
try {
    
    doSomething();
  } catch (err) {}
}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ArrayExpression with hole',
      code: `
try {
  const arr = [1, , 3];
  doSomething();
} catch (err) {}
`,
      output: `
const arr = [1, , 3];
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ArrowFunctionExpression',
      code: `
try {
  const fn = () => {};
  doSomething();
} catch (err) {}
`,
      output: `
const fn = () => {};
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ClassExpression',
      code: `
try {
  const C = class {};
  doSomething();
} catch (err) {}
`,
      output: `
const C = class {};
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ArrayPattern in destructuring',
      code: `
const arr = [1, 2];
try {
  const [a, b] = arr;
  doSomething();
} catch (err) {}
`,
      output: `
const arr = [1, 2];
const [a, b] = arr;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ObjectPattern in destructuring',
      code: `
const obj = { a: 1, b: 2 };
try {
  const { a, b } = obj;
  doSomething();
} catch (err) {}
`,
      output: `
const obj = { a: 1, b: 2 };
const { a, b } = obj;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSInstantiationExpression',
      code: `
try {
  const x = foo<number>;
  doSomething();
} catch (err) {}
`,
      output: `
const x = foo<number>;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: ObjectExpression with AssignmentPattern',
      code: `
try {
  const obj = ({ a = 1 } = {});
  doSomething();
} catch (err) {}
`,
      output: `
const obj = ({ a = 1 } = {});
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSModuleDeclaration',
      code: `
try {
  module M {}
  doSomething();
} catch (err) {}
`,
      output: `
module M {}
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSTypeAliasDeclaration',
      code: `
try {
  type Foo = number;
  doSomething();
} catch (err) {}
`,
      output: `
type Foo = number;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: Nested destructuring with ArrayPattern',
      code: `
const data = [[1, 2]];
try {
  const [[a, b]] = data;
  doSomething();
} catch (err) {}
`,
      output: `
const data = [[1, 2]];
const [[a, b]] = data;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: Nested destructuring with ObjectPattern',
      code: `
const data = { x: { y: 1 } };
try {
  const {
    x: { y },
  } = data;
  doSomething();
} catch (err) {}
`,
      output: `
const data = { x: { y: 1 } };
const {
    x: { y },
  } = data;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: Empty for loop',
      code: `
try {
  for (;;) {}
  doSomething();
} catch (err) {}
`,
      output: `
for (;;) {}
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSDeclareFunction',
      code: `
try {
  declare function foo(): void;
  doSomething();
} catch (err) {}
`,
      output: `
declare function foo(): void;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSEnumDeclaration',
      code: `
try {
  enum Foo {
    A,
    B,
  }
  doSomething();
} catch (err) {}
`,
      output: `
enum Foo {
    A,
    B,
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSExportAssignment',
      code: `
try {
  export = foo;
  doSomething();
} catch (err) {}
`,
      output: `
export = foo;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSImportEqualsDeclaration',
      code: `
try {
  import foo = require('foo');
  doSomething();
} catch (err) {}
`,
      output: `
import foo = require('foo');
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSInterfaceDeclaration',
      code: `
try {
  interface Foo {
    x: number;
  }
  doSomething();
} catch (err) {}
`,
      output: `
interface Foo {
    x: number;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: TSEmptyBodyFunctionExpression',
      code: `
try {
  declare const foo: () => void;
  doSomething();
} catch (err) {}
`,
      output: `
declare const foo: () => void;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several variable declarators (all safe)',
      code: `
try {
  const x = 42,
    y = 105;
  doSomething();
} catch (err) {}
`,
      output: `
const x = 42,
    y = 105;
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Safe: AssignmentPattern in ArrayPattern',
      code: `
try {
  const [x = 42] = [];
} catch (err) {}
`,
      output: `
const [x = 42] = [];
try {
  
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'If statement with early return',
      code: `
try {
  if (!cond) {
    return;
  }

  doSomething();
} catch (err) {}
`,
      output: `
if (!cond) {
    return;
  }
try {
  

  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'If statement with safe consequent and safe alternate',
      code: `
try {
  if (cond) {
    ('safe');
  } else {
    const x = 1;
  }
  doSomething();
} catch (err) {}
`,
      output: `
if (cond) {
    ('safe');
  } else {
    const x = 1;
  }
try {
  
  doSomething();
} catch (err) {}
`,
      errors: [{ messageId: 'noSafeLine' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

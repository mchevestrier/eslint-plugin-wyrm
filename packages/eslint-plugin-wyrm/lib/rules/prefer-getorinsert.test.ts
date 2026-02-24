import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-getorinsert.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With `Map#getOrInsert` #docs',
      code: `
map.getOrInsert(key, defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'non-member expression callee',
      code: `
set(key, map.get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with non-identifier object',
      code: `
getMap().set(key, getMap().get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with computed property',
      code: `
map['set'](key, map.get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not `set`',
      code: `
map.notSet(key, map.get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with non-nullish coalescing operator',
      code: `
map.set(key, map.get(key) || defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with no key argument',
      code: `
map.set();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with no value argument',
      code: `
map.set(key);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with too many arguments',
      code: `
map.set(key, map.get(key) ?? defaultValue, extraArg);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with non-logical expression',
      code: `
map.set(key, defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get from different map',
      code: `
map.set(key, otherMap.get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get using different key',
      code: `
map.set(key, map.get(otherKey) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get that has multiple arguments',
      code: `
map.set(key, map.get(key, extra) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with non-call expression on left of ??',
      code: `
map.set(key, value ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get that has non-member expression callee',
      code: `
map.set(key, get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get that has non-identifier object',
      code: `
map.set(key, getMap().get(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get that has computed property',
      code: `
map.set(key, map['get'](key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with method other than get',
      code: `
map.set(key, map.has(key) ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'set with get that has no arguments',
      code: `
map.set(key, map.get() ?? defaultValue);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if statement with no test',
      code: `
function foo() {
  if (true) {
    return 42;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has with no arguments',
      code: `
function foo(key: string) {
  if (map.has()) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but get has no arguments',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get();
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but keys do not match',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(otherKey);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with non-call expression test',
      code: `
function foo(key: string) {
  if (hasKey) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with non-member expression callee',
      code: `
function foo(key: string) {
  if (has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with non-identifier object in has call',
      code: `
function foo(key: string) {
  if (getMap().has(key)) {
    return getMap().get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with computed property in has call',
      code: `
function foo(key: string) {
  if (map['has'](key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with method other than has',
      code: `
function foo(key: string) {
  if (map.get(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but else branch exists',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  } else {
    return null;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but only one statement after',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set expression is not a call',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  someValue;
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set is not member expression',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set object is not identifier',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  getMap().set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set property is computed',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map['set'](key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set property is not named set',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.delete(key);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but then branch is not single return',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    console.log('found');
    return map.get(key);
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but no set/return after',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  console.log('done');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set has no key',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set();
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set uses different key',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(otherKey, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but set uses different map',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  otherMap.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return uses different value',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return otherValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if nested without block (parent is not BlockStatement)',
      code: `
function foo(key: string) {
  if (condition)
    if (map.has(key)) {
      return map.get(key);
    }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but then branch has no statements',
      code: `
function foo(key: string) {
  if (map.has(key)) {
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return argument is not call expression',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return value;
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return calls non-member expression',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return calls non-identifier object',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return getMap().get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return uses different map',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return otherMap.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return uses computed property',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map['get'](key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return calls method other than get',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.has(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but first statement is not return',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    console.log('found');
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return has no argument',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return;
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but next statement is not expression statement',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  const x = 42;
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but third statement is not return',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  console.log('done');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but return statement has no argument',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but no sibling statements following if statement',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has but inline if consequent branch is not a return statement',
      code: `
function foo(key: string) {
  if (map.has(key)) map.get(key);
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has and else statement',
      code: `
function foo(key: string) {
  if (map.has(key)) return map.get(key);
  else {
    console.log('fnord');
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'if with map.has and inline else statement',
      code: `
function foo(key: string) {
  if (map.has(key)) return map.get(key);
  else console.log('fnord');
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with non-|| and non-?? operator',
      code: `
m.get('foo') && m.set('foo', 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with non-call expression on left',
      code: `
value || (m.set('foo', 42) && 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with non-get call on left',
      code: `
m.has('foo') || (m.set('foo', 42) && 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with non-logical expression on right',
      code: `
m.get('foo') || m.set('foo', 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with && on top level instead of ||',
      code: `
m.get('foo') && m.set('foo', 42) && 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with && and inner && (should not match without operator check)',
      code: `
m.get('foo') && (m.set('foo', 42) && 42);
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'logical expression with || instead of && on right logical expression',
      code: `
const x = m.get('foo') || (m.set('foo', 42) || 42);
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'logical expression with non-set call on right left',
      code: `
m.get('foo') || (m.delete('foo') && 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with different map in set',
      code: `
m.get('foo') || (other.set('foo', 42) && 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with different keys',
      code: `
m.get('foo') || (m.set('bar', 42) && 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'logical expression with right side not matching set value or left side',
      code: `
m.get('foo') || (m.set('foo', 42) && 99);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Then branch with multiple statements where first is return',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
    console.log('unreachable');
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With Map#has in a condition #docs',
      code: `
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
function foo(key: string) {
  return map.getOrInsert(key, defaultValue);
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
      name: 'if with map.has and inline if',
      code: `
function foo(key: string) {
  if (map.has(key)) return map.get(key);
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
function foo(key: string) {
  return map.getOrInsert(key, defaultValue);
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
      name: 'if with map.has and more statements following return statements',
      code: `
function foo(key: string) {
  if (map.has(key)) return map.get(key);
  map.set(key, defaultValue);
  return defaultValue;

  function quux() {}
}
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
function foo(key: string) {
  return map.getOrInsert(key, defaultValue);

  function quux() {}
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
      name: 'if with map.has and statements before map get',
      code: `
function foo(key: string) {
  if (key === 'fnord') return null;
  if (map.has(key)) return map.get(key);
  map.set(key, defaultValue);
  return defaultValue;
}
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
function foo(key: string) {
  if (key === 'fnord') return null;
  return map.getOrInsert(key, defaultValue);
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
      name: 'if with map.has and an inner scope block',
      code: `
function foo(key: string) {
  {
    if (map.has(key)) {
      return map.get(key);
    }
    map.set(key, defaultValue);
    return defaultValue;
  }
}
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
function foo(key: string) {
  {
    return map.getOrInsert(key, defaultValue);
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
      name: 'With Map#set and a nullish coalescing fallback #docs',
      code: `
map.set(key, map.get(key) ?? defaultValue);
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
map.getOrInsert(key, defaultValue);
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
      name: 'With disjunction and conjunction #docs (with get call in right side)',
      code: `
m.get('foo') || (m.set('foo', 42) && m.get('foo'));
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
m.getOrInsert('foo', 42);
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
      name: 'With disjunction and conjunction (with default value in right side)',
      code: `
m.get('foo') || (m.set('foo', 42) && 42);
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
m.getOrInsert('foo', 42);
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
      name: 'With nullish coalescing and conjunction, with get call in right side',
      code: `
m.get('foo') ?? (m.set('foo', 42) && m.get('foo'));
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
m.getOrInsert('foo', 42);
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
      name: 'With nullish coalescing and conjunction, with default value in right side',
      code: `
m.get('foo') ?? (m.set('foo', 42) && 42);
`,
      errors: [
        {
          messageId: 'preferGetOrInsert',
          suggestions: [
            {
              messageId: 'useGetOrInsert',
              output: `
m.getOrInsert('foo', 42);
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

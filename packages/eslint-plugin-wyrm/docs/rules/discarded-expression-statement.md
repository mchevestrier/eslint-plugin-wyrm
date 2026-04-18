# wyrm/discarded-expression-statement

📝 Forbid discarding the result of expression statements.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Number literal in expression statement:

```tsx
42;
```

String literal in expression statement:

```tsx
'foo';
```

Awaited `Promise<number>`:

```tsx
async function foo(): Promise<number> {
  return 42;
}
await foo();
```

### Correct ✅

Call expression of a function returning void:

```tsx
function foo() {}

foo();
```

String literal directive:

```tsx
'use strict';
```

Return value is ignored by wrapping in `void`:

```tsx
function foo() {
  return 42;
}

void foo();
```

Return value is ignored by assigning to a variable:

```tsx
function foo() {
  return 42;
}

const _ = foo();
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name               | Description                                               | Type     |
| :----------------- | :-------------------------------------------------------- | :------- |
| `ignoredFunctions` | Names of functions to ignore. Default: `[]`               | String[] |
| `ignoredMethods`   | Names of methods to ignore. Default: `[]`                 | String[] |
| `ignoredObjects`   | Names of objects to ignore in method calls. Default: `[]` | String[] |
| `ignorePromises`   | Whether to ignore floating promises. Default: `true`      | Boolean  |

<!-- end auto-generated rule options list -->

## See also

- `@typescript-eslint/no-floating-promises`
- `@typescript-eslint/no-unused-expressions`
- `sonarjs/no-ignored-return`
- `functional/no-expression-statements`

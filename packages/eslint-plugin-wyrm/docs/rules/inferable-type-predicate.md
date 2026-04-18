# wyrm/inferable-type-predicate

📝 Forbid inferable type predicates.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Inferable type predicate:

```tsx
function isString(x: unknown): x is string {
  return typeof x === 'string';
}

// Automatically fixed to:
function isString(x: unknown) {
  return typeof x === 'string';
}
```

Type predicate in a callback:

```tsx
[1, 2, 3, null, 5].filter((x): x is string => typeof x === 'string');

// Automatically fixed to:
[1, 2, 3, null, 5].filter((x) => typeof x === 'string');
```

Null inequality when the parameter type is a union:

```tsx
[1, 2, 3, null, 5].filter((x): x is number => x !== null);

// Automatically fixed to:
[1, 2, 3, null, 5].filter((x) => x !== null);
```

Undefined inequality when the parameter type is a union:

```tsx
[1, 2, 3, undefined, 5].filter((x): x is number => x !== undefined);

// Automatically fixed to:
[1, 2, 3, undefined, 5].filter((x) => x !== undefined);
```

Nullish inequality when the parameter type is a union:

```tsx
[1, 2, 3, undefined, 5].filter((x): x is number => x != null);

// Automatically fixed to:
[1, 2, 3, undefined, 5].filter((x) => x != null);
```

String literal equality:

```tsx
function isString(x: unknown): x is string {
  return x === 'foo';
}

// Automatically fixed to:
function isString(x: unknown) {
  return x === 'foo';
}
```

Number literal equality:

```tsx
function isString(x: unknown): x is number {
  return x === 42;
}

// Automatically fixed to:
function isString(x: unknown) {
  return x === 42;
}
```

Boolean literal equality:

```tsx
function isString(x: unknown): x is boolean {
  return x === false;
}

// Automatically fixed to:
function isString(x: unknown) {
  return x === false;
}
```

Null equality:

```tsx
function isString(x: unknown): x is null {
  return x === null;
}

// Automatically fixed to:
function isString(x: unknown) {
  return x === null;
}
```

Undefined equality:

```tsx
function isString(x: unknown): x is undefined {
  return x === undefined;
}

// Automatically fixed to:
function isString(x: unknown) {
  return x === undefined;
}
```

### Correct ✅

Not a type guard:

```tsx
function isString(x: unknown) {
  return typeof x === 'string';
}
```

Type predicate is not inferable:

```tsx
function isNotString(x: unknown): x is null {
  return typeof x !== 'string';
}
```

<!-- end auto-generated rule header -->

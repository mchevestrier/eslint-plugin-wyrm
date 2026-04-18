# wyrm/no-type-guard

📝 Forbid type guards.

## Cases

### Incorrect ❌

Type guard:

```tsx
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
```

With `asserts`:

```tsx
function assertsIsString(x: unknown): asserts x is string {
  if (typeof x === 'string') return;
  throw Error('Not a string');
}
```

### Correct ✅

Not a type guard:

```tsx
function isString(x: unknown) {
  return typeof x === 'string';
}
```

Simple return type:

```tsx
function getString(x: unknown): string | null {
  if (typeof x === 'string') return x;
  return null;
}
```

Type predicate in a callback:

```tsx
[1, 2, 3, null, 5].filter((x): x is string => typeof x === 'string');
```

<!-- end auto-generated rule header -->

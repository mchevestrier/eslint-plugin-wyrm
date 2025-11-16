# Forbid optional parameters in type guards (`wyrm/no-optional-type-guard-param`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Parameter used in type predicate is optional:

```tsx
function isString(x?: unknown): x is string {
  return typeof x === 'string';
}
```

Parameter used in `asserts` type predicate is optional:

```tsx
function isString(x?: unknown): asserts x is string {
  if (typeof x !== 'string') throw Error('oh no');
}
```

### Correct ✅

Parameter is not optional:

```tsx
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
```

Parameter is not optional but uses `undefined`:

```tsx
function isString(x: string | undefined): x is string {
  return typeof x === 'string';
}
```

<!-- end auto-generated rule header -->

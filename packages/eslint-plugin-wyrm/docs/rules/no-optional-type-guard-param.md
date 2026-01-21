# wyrm/no-optional-type-guard-param

📝 Forbid optional parameters in type guards.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

In TypeScript, marking a function parameter as optional
means the function can be called without passing an argument for this parameter.
But calling a type guard without an argument makes no sense,
as the function is supposed to assert the type of this argument.

**Example:**

```ts
// Here, `x` is optional, so `isString()` can be called without any argument
function isString(x?: unknown): x is string {
  return typeof x === 'string';
}

isString(); // This would certainly be a mistake, but TypeScript would not complain
```

Instead, you can use a type union to mark the parameter as possibly undefined.

**Example:**

```ts
function isString(x: string | undefined): x is string {
  return typeof x === 'string';
}

isString(); // Now TypeScript will complain if we forget to pass an argument
```

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

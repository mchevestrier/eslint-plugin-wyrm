# wyrm/no-useless-logical-fallback

📝 Forbid useless fallback values for logical expressions.

💼 This rule is enabled in the following configs: ✅ `recommendedTypeChecked`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Description

This rule warns when the component of a logical expression does not have any effect on the result of the expression.

**Example:**

```ts
declare const foo: string | undefined;
foo ?? undefined; // foo cannot be `null`, so the nullish coalescing `?? undefined` does not have any observable effect.

declare const bar: string;
bar || ''; // The empty string is the only possible falsy value for strings, so the right side is unnecessary.
```

The rule also warns in some cases when the component of a logical expression makes the type of the expression constant.

**Example:**

```ts
declare const quux: boolean;
quux && false; // This will always be false
```

## Cases

### Incorrect ❌

With `?? undefined`:

```tsx
function quux(foo: string | undefined) {
  return foo ?? undefined;
}

// Can be fixed to:
function quux(foo: string | undefined) {
  return foo;
}
```

With `?? null`:

```tsx
function quux(foo: string | null) {
  return foo ?? null;
}

// Can be fixed to:
function quux(foo: string | null) {
  return foo;
}
```

With `|| false`:

```tsx
function quux(foo: boolean) {
  return foo || false;
}

// Can be fixed to:
function quux(foo: boolean) {
  return foo;
}
```

With `&& true`:

```tsx
function quux(foo: boolean) {
  return foo && true;
}

// Can be fixed to:
function quux(foo: boolean) {
  return foo;
}
```

With `&& false` (constant expression):

```tsx
function quux(foo: boolean) {
  return foo && false;
}

// Can be fixed to:
function quux(foo: boolean) {
  return foo;
}
```

With `|| true` (constant expression):

```tsx
function quux(foo: boolean) {
  return foo || true;
}

// Can be fixed to:
function quux(foo: boolean) {
  return foo;
}
```

`|| ''` when the left side is exclusively a string:

```tsx
function quux(foo: string) {
  return foo || '';
}

// Can be fixed to:
function quux(foo: string) {
  return foo;
}
```

### Correct ✅

Possibly `null` with fallback to `undefined`:

```tsx
function quux(foo: string | null) {
  return foo ?? undefined;
}
```

Possibly `undefined` with fallback to `null`:

```tsx
function quux(foo: string | undefined) {
  return foo ?? null;
}
```

<!-- end auto-generated rule header -->

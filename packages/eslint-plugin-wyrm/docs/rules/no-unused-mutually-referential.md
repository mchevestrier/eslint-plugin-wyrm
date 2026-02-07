# wyrm/no-unused-mutually-referential

📝 Forbid unused functions, even if mutually referential.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

If two functions both reference each other but are not used anywhere else,
tools like TypeScript or ESLint will not mark them as unused.

This rule forbids all unused functions, even if they mutually reference each other.

## Cases

### Incorrect ❌

One unused function:

```tsx
function foo(n: number): number {
  if (n === 0) return 0;
  return n + 1;
}

// foo() is not used anywhere
```

Two unused functions:

```tsx
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

// foo() and bar() are not used anywhere else
```

Three unused functions:

```tsx
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return baz(n - 1) + 1;
}

function baz(n: number): number {
  if (n === 0) return 42;
  return foo(n - 1);
}

// foo(), bar() and baz() are not used anywhere else
```

### Correct ✅

One used function:

```tsx
function foo(n: number): number {
  if (n === 0) return 0;
  return n + 1;
}

foo(10);
```

One of two functions is used:

```tsx
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

foo(42);
```

One of two functions is exported:

```tsx
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

export function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
```

<!-- end auto-generated rule header -->

# Forbid duplicated branches with early returns (`wyrm/no-duplicated-return`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Return value is the same for the early return and the final return:

```tsx
function foo() {
  if (Math.random()) return null;
  return null;
}
```

With duplicated branches and empty returns:

```tsx
function foo() {
  if (Math.random()) {
    console.log('ok');
    return;
  }
  console.log('ok');
}
```

### Correct ✅

No duplicated return:

```tsx
function foo() {
  if (Math.random()) return null;
  if (Math.random()) return null;
  return 42;
}
```

<!-- end auto-generated rule header -->

## When not to use this rule

Having several branches with the same statements is sometimes necessary for TypeScript to correctly narrow types with flow analysis:

```ts
function foo(arg: string): string;
function foo(arg: number): number;
function foo(arg: string | number): string | number {
  return arg;
}

function id(x: string | number) {
  if (typeof x === 'string') {
    return foo(x);
  }

  return foo(x);
}
```

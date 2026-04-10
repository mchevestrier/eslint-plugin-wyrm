# wyrm/await-promise-resolve

📝 Forbid `await Promise.resolve()`.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

`await Promise.resolve()`:

```tsx
async function foo() {
  await Promise.resolve();
}

// Automatically fixed to:
async function foo() {}
```

With an argument:

```tsx
async function foo(x: unknown) {
  await Promise.resolve(x);
}

// Automatically fixed to:
async function foo(x: unknown) {
  await x;
}
```

`return await Promise.resolve()`:

```tsx
async function foo() {
  return await Promise.resolve();
}

// Automatically fixed to:
async function foo() {
  return undefined;
}
```

### Correct ✅

Not immediately awaited:

```tsx
const promise = Promise.resolve(42);
```

<!-- end auto-generated rule header -->

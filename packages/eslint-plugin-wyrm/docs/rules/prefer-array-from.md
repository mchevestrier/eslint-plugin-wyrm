# wyrm/prefer-array-from

📝 Enforce using `Array.from` or `Array.fromAsync` over iterative accumulation.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Iterative accumulation:

```tsx
function foo(strings: Iterator<string>) {
  const arr = [];
  for (const str of strings) {
    arr.push(str);
  }
  return arr;
}

// Automatically fixed to:
function foo(strings: Iterator<string>) {
  const arr = Array.from(strings);

  return arr;
}
```

Async iterative accumulation:

```tsx
function foo(strings: AsyncIterator<string>) {
  const arr = [];
  for await (const str of strings) {
    arr.push(str);
  }
  return arr;
}

// Automatically fixed to:
function foo(strings: AsyncIterator<string>) {
  const arr = Array.fromAsync(strings);

  return arr;
}
```

With a non empty initial array:

```tsx
function foo(strings: Iterator<string>) {
  const arr = ['foo', 'bar'];
  for (const str of strings) {
    arr.push(str);
  }
  return arr;
}

// Automatically fixed to:
function foo(strings: Iterator<string>) {
  const arr = ['foo', 'bar'].concat(Array.from(strings));

  return arr;
}
```

### Correct ✅

Using `Array.from`:

```tsx
function foo(strings: Iterator<string>) {
  let res = Array.from(strings);
  return res;
}
```

<!-- end auto-generated rule header -->

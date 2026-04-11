# wyrm/prefer-string-join

📝 Enforce usage of `String.prototype.join`.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Not using `String.prototype.join`:

```tsx
function foo(strings: string[]) {
  let res = '';
  for (const str of strings) {
    res += str;
  }
  return res;
}

// Automatically fixed to:
function foo(strings: string[]) {
  let res = strings.join();

  return res;
}
```

With a non empty initial value:

```tsx
function foo(strings: string[]) {
  let res = 'quux';
  for (const str of strings) {
    res += str;
  }
  return res;
}

// Automatically fixed to:
function foo(strings: string[]) {
  let res = 'quux'.concat(strings.join());

  return res;
}
```

### Correct ✅

Using `String.prototype.join`:

```tsx
function foo(strings: string[]) {
  let res = strings.join();
  return res;
}
```

<!-- end auto-generated rule header -->

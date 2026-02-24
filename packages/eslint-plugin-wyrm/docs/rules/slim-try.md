# wyrm/slim-try

📝 Enforce moving safe statements out of `try` blocks.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Description

This rule warns when the first statement in a `try` block is unlikely to raise any exception.

The intention is to reduce the size of `try` blocks that can sometimes be unnecessarily huge.

## Cases

### Incorrect ❌

Simple literal assignment inside `try` block:

```tsx
try {
  const url = '/foo';
  await fetch(url);
} catch (err) {
  console.error(err);
}

// Automatically fixed to:
const url = '/foo';
try {
  await fetch(url);
} catch (err) {
  console.error(err);
}
```

### Correct ✅

Simple literal assignment outside `try` block:

```tsx
const url = '/foo';
try {
  await fetch(url);
} catch (err) {
  console.error(err);
}
```

<!-- end auto-generated rule header -->

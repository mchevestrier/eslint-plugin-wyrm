# wyrm/prefer-finally

📝 Enforce using `finally` rather than duplicating code in `try` and `catch` blocks.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

With a duplicate final statement in `try` and `catch` blocks:

```tsx
try {
  console.log('try');
  debugger;
} catch {
  console.log('catch');
  debugger;
}

// Can be fixed to:
try {
  console.log('try');
} catch {
  console.log('catch');
} finally {
  debugger;
}
```

### Correct ✅

With `finally`:

```tsx
try {
  console.log('try');
} catch {
  console.log('catch');
} finally {
  debugger;
}
```

<!-- end auto-generated rule header -->

# Enforce usage of `Promise.prototype.catch()` when it improves readability (`wyrm/prefer-catch-method`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

Conditional assignment based on asynchronous result:

```tsx
let result;
try {
  result = await getStuff();
} catch (err) {
  console.error(err);
  result = null;
}
```

### Correct ✅

Correct usage of `Promise.prototype.catch()`:

```tsx
let result = await getStuff().catch((err: unknown) => {
  console.error(err);
  return null;
});
```

`try` block with no async operation:

```tsx
let result;
try {
  result = JSON.stringify('{}');
} catch (err) {
  console.error(err);
  result = null;
}
```

<!-- end auto-generated rule header -->

# Enforce usage of `String.prototype.repeat` (`wyrm/prefer-repeat`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

Not using `String.prototype.repeat`:

```tsx
const x = Array.from({ length: 3 }).reduce((acc) => `${acc}*`, '');

// Can be fixed to:
const x = '*'.repeat(3);
```

### Correct ✅

Using `String.prototype.repeat`:

```tsx
const x = '*'.repeat(3);
```

<!-- end auto-generated rule header -->

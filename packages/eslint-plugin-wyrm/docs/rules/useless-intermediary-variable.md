# wyrm/useless-intermediary-variable

📝 Disallow unnecessary intermediary variables.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

Declaring another variable initialized with a simple identifier:

```tsx
const foo = 42;
const bar = foo;
return bar + 3;

// Can be fixed to:
const bar = 42;

return bar + 3;
```

### Correct ✅

No useless intermediary variable:

```tsx
const bar = 42;
return bar + 3;
```

<!-- end auto-generated rule header -->

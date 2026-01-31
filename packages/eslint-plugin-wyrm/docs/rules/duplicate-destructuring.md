# wyrm/duplicate-destructuring

📝 Forbid duplicate keys in object destructuring patterns.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Duplicate identifier key:

```tsx
const { length: bar, length: baz } = [];
```

### Correct ✅

No duplicate key:

```tsx
const { map: at, at: map } = [];
```

<!-- end auto-generated rule header -->

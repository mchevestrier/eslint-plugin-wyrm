# wyrm/nullish-object-spread

📝 Forbid useless empty object fallback for nullish values in object spread.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Useless fallback:

```tsx
const foo = null;
const obj = { ...(foo ?? {}) };
```

### Correct ✅

No useless fallback:

```tsx
const foo = null;
const obj = { ...foo };
```

<!-- end auto-generated rule header -->

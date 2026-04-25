# wyrm/as-unknown-as

📝 Forbid `as unknown as`.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`as unknown as Y`:

```tsx
const foo = bar as unknown as string;
```

### Correct ✅

`as unknown`:

```tsx
const foo = bar as unknown;
```

<!-- end auto-generated rule header -->

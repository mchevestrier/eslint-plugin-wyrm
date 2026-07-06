# wyrm/duplicate-condition

📝 Forbid duplicate conditions.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Duplicate condition:

```tsx
if (foo > 42) {
  return 'foo';
}
if (foo > 42) {
  return 'bar';
}
```

### Correct ✅

No duplicate condition:

```tsx
if (foo > 42) {
  return 'foo';
}
if (bar > 42) {
  return 'bar';
}
```

<!-- end auto-generated rule header -->

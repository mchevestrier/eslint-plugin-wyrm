# Forbid duplicated branches with early returns (`wyrm/no-duplicated-return`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Return value is the same for the early return and the final return:

```tsx
function foo() {
  if (Math.random()) return null;
  return null;
}
```

### Correct ✅

No duplicated return:

```tsx
function foo() {
  if (Math.random()) return null;
  if (Math.random()) return null;
  return 42;
}
```

<!-- end auto-generated rule header -->

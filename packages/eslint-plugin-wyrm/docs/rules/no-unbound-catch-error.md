# wyrm/no-unbound-catch-error

📝 Forbid `catch` clauses with unbound errors.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Unbound error in `catch` clause:

```tsx
try {
  // ...
} catch {
  // ...
}
```

### Correct ✅

Bound error in `catch` clause:

```tsx
try {
  // ...
} catch (err) {
  // ...
}
```

<!-- end auto-generated rule header -->

# wyrm/no-commented-out-comment

📝 Forbid commented out comments.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Commented out comment:

```tsx
// // foo
```

Commented out block comment:

```tsx
// /* foo */
```

### Correct ✅

Normal comment:

```tsx
// foo
```

Normal block comment:

```tsx
/* foo */
```

<!-- end auto-generated rule header -->

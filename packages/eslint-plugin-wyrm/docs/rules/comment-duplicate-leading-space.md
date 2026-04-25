# wyrm/comment-duplicate-leading-space

📝 Forbid duplicate leading space in comments.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Duplicate leading space:

```tsx
//  Duplicate leading space

// Automatically fixed to:
// Duplicate leading space
```

Duplicate leading space in a block comment:

```tsx
/*  Duplicate leading space */

// Automatically fixed to:
/* Duplicate leading space */
```

### Correct ✅

Only one leading space:

```tsx
// Only one leading space
```

Two spaces but not leading:

```tsx
// Two spaces  but not leading
```

Three leading spaces:

```tsx
//   Three leading spaces
```

<!-- end auto-generated rule header -->

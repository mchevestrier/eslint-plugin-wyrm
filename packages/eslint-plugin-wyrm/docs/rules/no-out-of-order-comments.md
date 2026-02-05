# wyrm/no-out-of-order-comments

📝 Forbid out of order numbered comments.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Inline numbered comments, out of order:

```tsx
// 1. Do stuff
// 3. Do stuff
// 2. Do stuff
```

Inline numbered comments, with one missing number:

```tsx
// 1. Do stuff
// 3. Do stuff
```

With a prefix:

```tsx
// Step 1: Do stuff
// Step 3: Do stuff
// Step 2: Do stuff
```

### Correct ✅

Numbered comments in order:

```tsx
// 1. Ok
// 2. Ok
// 3. Ok

// 1. Ok
// 2. Ok
```

<!-- end auto-generated rule header -->

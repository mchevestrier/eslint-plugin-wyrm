# wyrm/no-useless-ts-check

📝 Forbid useless `@ts-check` comments in TypeScript files.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Useless `@ts-check` comment:

```tsx
// File name: foo.ts

// @ts-check
```

### Correct ✅

Useful `@ts-check` comment in a JS file:

```tsx
// File name: foo.js

// @ts-check
```

<!-- end auto-generated rule header -->

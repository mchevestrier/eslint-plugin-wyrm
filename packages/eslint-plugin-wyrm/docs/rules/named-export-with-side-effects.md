# wyrm/named-export-with-side-effects

📝 Forbid named exports in files with side effects.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Named export and side effect in the same file:

```tsx
export const foo = 42;

try {
  await fetch('https://example.com/');
} finally {
}
```

### Correct ✅

Named export but no side effect:

```tsx
export const foo = 42;
```

Side effect but no named export:

```tsx
try {
  await fetch('https://example.com/');
} finally {
}
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name     | Description                                                                     | Type    |
| :------- | :------------------------------------------------------------------------------ | :------ |
| `strict` | Whether to consider call expressions as possible side effects. Default: `false` | Boolean |

<!-- end auto-generated rule options list -->

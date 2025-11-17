# Forbid confusing naming for "first" or "last" (`wyrm/no-first-last`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

First last:

```tsx
const firstFoo = arr.at(-1);
```

First last (with `findLast`):

```tsx
const firstFoo = arr.findLast(() => true);
```

Last first:

```tsx
const lastFoo = arr[0];
```

### Correct ✅

Last last:

```tsx
const lastFoo = arr.at(-1);
```

First first:

```tsx
const firstFoo = arr.at(0);
```

<!-- end auto-generated rule header -->

# Forbid empty comments (`wyrm/no-empty-comment`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Empty inline comment:

```tsx
//
```

Empty block comment:

```tsx
/* */
```

Empty JSDoc comment:

```tsx
/** */
```

Empty padding comments (with `allowPadding: false`):

```tsx
//
// Ok
//
```

Too many empty padding comments (with `allowPadding: true`):

```tsx
//
// Ok
//
//
```

### Correct ✅

Not an empty comment:

```tsx
// Ok
```

Empty padding comments (with `allowPadding: true`):

```tsx
//
// Ok
//
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name           | Description                                                                                 | Type    |
| :------------- | :------------------------------------------------------------------------------------------ | :------ |
| `allowPadding` | Whether to allow empty padding comments stacked next to non-empty comments. Default: `true` | Boolean |

<!-- end auto-generated rule options list -->

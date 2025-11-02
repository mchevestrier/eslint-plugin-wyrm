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

Stacked empty comments (with `allowStacked: false`):

```tsx
//
// Ok
//
```

Several stacked empty comments (with `allowStacked: true`):

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

Stacked empty comments (with `allowStacked: true`):

```tsx
//
// Ok
//
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name           | Description                                                                          | Type    |
| :------------- | :----------------------------------------------------------------------------------- | :------ |
| `allowStacked` | Whether to allow empty comments stacked next to non-empty comments. Default: `false` | Boolean |

<!-- end auto-generated rule options list -->

# wyrm/no-inline-jsdoc-tag

📝 Forbid JSDoc tags in code comments.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`@type` JSDoc tag in line comment:

```tsx
// @type {string}
```

`@fileoverview` JSDoc tag in single line block comment:

```tsx
/* @fileoverview */
```

`@param` JSDoc tag in multiline block comment:

```tsx
/*
 * @param {string} foo
 */
```

`@TODO` comment in line comment:

```tsx
// @TODO: You can't index the bus without quantifying the neural AGP program
```

### Correct ✅

`@deprecated` JSDoc tag in valid JSDoc comment:

```tsx
/** @deprecated Use the haptic hard drive instead */
```

Deprecated comment with no JSDoc tag:

```tsx
// Deprecated: Use the open-source TLS capacitor, then you can hack the redundant sensor
```

TODO comment with no JSDoc tag:

```tsx
// TODO: You can't index the bus without quantifying the neural AGP program
```

`// @ts-check`:

```tsx
// @ts-check
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name   | Description                                   | Type     |
| :----- | :-------------------------------------------- | :------- |
| `tags` | Additional JSDoc tags to check. Default: `[]` | String[] |

<!-- end auto-generated rule options list -->

# Forbid sloppy collection size checks (`wyrm/no-sloppy-length-check`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

This rule forbids comparisons that don't make sense since a size cannot be negative.

## Cases

### Incorrect ❌

`.length <= 0`:

```tsx
if (arr.length <= 0) {
}
```

`.size <= 0`:

```tsx
if (s.size <= 0) {
}
```

`.length >= 0`:

```tsx
if (arr.length >= 0) {
}
```

`.length < 0`:

```tsx
if (arr.length < 0) {
}
```

Comparing to a negative value:

```tsx
if (arr.length !== -4) {
}
```

`.size < 0`:

```tsx
if (s.size < 0) {
}
```

With a logical expression:

```tsx
if (arr.length > 0 || 0 === arr.length) {
}
```

### Correct ✅

`.length === 0`:

```tsx
if (arr.length === 0) {
}
```

`.size === 0`:

```tsx
if (s.size === 0) {
}
```

`.length > 0`:

```tsx
if (arr.length > 0) {
}
```

`.size > 0`:

```tsx
if (s.size > 0) {
}
```

`.length <= 2`:

```tsx
if (arr.length <= 2) {
}
```

`.length >= 2`:

```tsx
if (arr.length >= 2) {
}
```

<!-- end auto-generated rule header -->

## Related

- [unicorn/explicit-length-check](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/explicit-length-check.md)
- [sonarjs/no-collection-size-mischeck](https://sonarsource.github.io/rspec/#/rspec/S3981/javascript)

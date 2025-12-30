# Forbid disallowed comments like FIXME, XXX, HACK (`wyrm/no-disallowed-warning-comments`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

FIXME comment:

```tsx
// FIXME
```

HACK comment:

```tsx
// HACK: You can't index the bus without quantifying the neural AGP program
```

TOOD comment:

```tsx
// TOOD
```

ToDo comment:

```tsx
// ToDo
```

### Correct ✅

TODO comment:

```tsx
// TODO
```

<!-- end auto-generated rule header -->

# wyrm/no-float-length-check

📝 Forbid comparing a length to a floating point number.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Comparing a length to a floating point number:

```tsx
foo.length > 3.14;
```

Comparing a size to a floating point number:

```tsx
foo.size === 3.14;
```

### Correct ✅

Integer length comparison:

```tsx
foo.length > 3;
```

Integer size comparison:

```tsx
foo.size >= 42;
```

<!-- end auto-generated rule header -->

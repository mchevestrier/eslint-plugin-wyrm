# wyrm/exact-string-regex

📝 Forbid using a RegEx when string equality would suffice.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

Exact string RegEx:

```tsx
/^quux$/.test(foo);

// Can be fixed to:
foo === 'quux';
```

### Correct ✅

Using string equality:

```tsx
foo === 'quux';
```

With ignoreCase flag:

```tsx
/^quux$/i.test(foo);
```

With multiline flag:

```tsx
/^quux$/m.test(foo);
```

<!-- end auto-generated rule header -->

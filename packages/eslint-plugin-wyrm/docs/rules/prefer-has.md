# wyrm/prefer-has

📝 Enforce using `Map#has` and `Set#has`.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

With `!== undefined`:

```tsx
foo.get('bar') !== undefined;

// Automatically fixed to:
foo.has('bar');
```

With `typeof !== 'undefined'`:

```tsx
typeof foo.get('bar') !== 'undefined';

// Automatically fixed to:
foo.has('bar');
```

### Correct ✅

With `.has()`:

```tsx
foo.has('bar');
```

With `.get()` not being check for undefined:

```tsx
foo.get('bar');
```

<!-- end auto-generated rule header -->

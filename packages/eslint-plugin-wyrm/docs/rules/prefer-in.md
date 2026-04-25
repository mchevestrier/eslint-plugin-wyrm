# wyrm/prefer-in

📝 Prefer `in` to `Object.hasOwn()` and `Object.prototype.hasOwnProperty.call()`.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Description

`x in y` does not have the same behavior as `Object.hasOwn(y, x)` and `Object.prototype.hasOwnProperty.call(y, x)`.

But in the majority of cases, the difference does not really matter (modern codebases should already avoid objects with prototype chains anyway).

`x in y` is also more readable and better supported in TypeScript flow analysis for type narrowing.

## Cases

### Incorrect ❌

With `Object.hasOwn()`:

```tsx
Object.hasOwn(bar, foo);

// Can be fixed to:
foo in bar;
```

With `Object.prototype.hasOwnProperty.call()`:

```tsx
Object.prototype.hasOwnProperty.call(bar, foo);

// Can be fixed to:
foo in bar;
```

### Correct ✅

With `in`:

```tsx
foo in bar;
```

<!-- end auto-generated rule header -->

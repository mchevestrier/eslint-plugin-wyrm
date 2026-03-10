# wyrm/prefer-eqeq-null

📝 Enforce using `x == null` instead of `x === null || x === undefined`.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Description

Using weak equality (`==`) can make checking for nullishness more concise.

**Example:**

```ts
// With strict equality:
foo === null || foo === undefined;

// With weak equality:
foo == null;
```

Enabling this rule only makes sense if you didn't enable the [`eqeqeq` ESLint rule](https://eslint.org/docs/latest/rules/eqeqeq), or if you enabled it but allow null (either with the `smart` setting, with `allow-null` or with `{"null": "ignore"}`).

## Cases

### Incorrect ❌

Using `foo === null || foo === undefined`:

```tsx
foo === null || foo === undefined;

// Automatically fixed to:
foo == null;
```

Using `foo !== null && foo !== undefined`:

```tsx
foo !== null && foo !== undefined;

// Automatically fixed to:
foo != null;
```

### Correct ✅

Using `foo == null`:

```tsx
foo == null;
```

Using `foo != null`:

```tsx
foo != null;
```

<!-- end auto-generated rule header -->

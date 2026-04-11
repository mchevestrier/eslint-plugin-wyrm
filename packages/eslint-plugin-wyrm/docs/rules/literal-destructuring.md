# wyrm/literal-destructuring

📝 Forbid variable declaration by destructuring object or array literals.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Declaring a variable by destructuring a temporary object literal:

```tsx
const { foo } = { foo: 42 };

// Automatically fixed to:
const foo = 42;
```

Declaring a variable by destructuring a temporary array literal:

```tsx
const [foo] = [42];

// Automatically fixed to:
const foo = 42;
```

With a useless spread element that will never be read:

```tsx
const [foo] = [42, ...arr];

// Automatically fixed to:
const foo = 42;
```

With a useless spread property always overwritten by fixed properties:

```tsx
const { foo, bar } = { ...obj, foo: 42, bar: 105 };

// Automatically fixed to:
const foo = 42,
  bar = 105;
```

### Correct ✅

With a spread property after fixed properties:

```tsx
const { foo } = { foo: 42, ...obj };
```

With a spread property overwritten by some fixed properties:

```tsx
const { foo, bar } = { ...obj, foo: 42 };
```

With a spread property possibly overwriting some fixed property:

```tsx
const { foo, bar } = { bar: 105, ...obj, foo: 42 };
```

With a useful spread element:

```tsx
const [foo, bar] = [42, ...arr];
```

<!-- end auto-generated rule header -->

# wyrm/idiomatic-cast

📝 Enforce idiomatic ways to cast values.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Using `String()` with a number:

```tsx
declare const foo: number;
String(foo);

// Automatically fixed to:
declare const foo: number;
foo.toString();
```

### Correct ✅

Using `.toString()` with a number:

```tsx
declare const foo: number;
foo.toString();
```

Using `String()` with a nullable number:

```tsx
declare const foo: number | undefined;
String(foo);
```

<!-- end auto-generated rule header -->

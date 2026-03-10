# wyrm/eqeq-null

📝 Forbid using `x == null` when equivalent to `x === null`.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Using `== null` with a possibly null value:

```tsx
declare const foo: number | null;
foo == null;

// Automatically fixed to:
declare const foo: number | null;
foo === null;
```

Using `== null` with a possibly undefined value:

```tsx
declare const foo: number | undefined;
foo == null;

// Automatically fixed to:
declare const foo: number | undefined;
foo === undefined;
```

Using `!= null` with a possibly null value:

```tsx
declare const foo: number | null;
foo != null;

// Automatically fixed to:
declare const foo: number | null;
foo !== null;
```

Using `!= null` with a possibly undefined value:

```tsx
declare const foo: number | undefined;
foo != null;

// Automatically fixed to:
declare const foo: number | undefined;
foo !== undefined;
```

Using `== null` with a definitely nullish value:

```tsx
declare const foo: null | undefined;
foo == null;
```

Using `!= null` with a definitely nullish value:

```tsx
declare const foo: null | undefined;
foo != null;
```

### Correct ✅

Using `== null` with a possibly nullish value:

```tsx
declare const foo: number | null | undefined;
foo == null;
```

Using `== undefined` with a possibly nullish value:

```tsx
declare const foo: number | null | undefined;
foo == undefined;
```

<!-- end auto-generated rule header -->

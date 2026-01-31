# wyrm/primitive-valueof

📝 Forbid calling `.valueOf()` on a primitive.

💼 This rule is enabled in the following configs: ✅ `recommendedTypeChecked`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Calling `.valueOf()` on a number:

```tsx
const val = 42;
val.valueOf();

// Automatically fixed to:
const val = 42;
val;
```

Calling `.valueOf()` on a string:

```tsx
const val = 'foo';
val.valueOf();

// Automatically fixed to:
const val = 'foo';
val;
```

Calling `.valueOf()` on a boolean:

```tsx
const val = false;
val.valueOf();

// Automatically fixed to:
const val = false;
val;
```

### Correct ✅

Calling `.valueOf()` on a Date object:

```tsx
const val = new Date();
val.valueOf();
```

Calling `.valueOf()` on a number | Date:

```tsx
declare const val: number | Date;
val.valueOf();
```

<!-- end auto-generated rule header -->

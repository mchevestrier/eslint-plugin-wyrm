# wyrm/no-obvious-any

📝 Forbid using `any` when a stricter type can be trivially inferred.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Assignment of a number literal, typed as `any`:

```tsx
const foo: any = 42;

// Automatically fixed to:
const foo: number = 42;
```

Assignment of a string literal, typed as `any`:

```tsx
let foo: any = 'ok';

// Automatically fixed to:
let foo: string = 'ok';
```

Assignment of a boolean literal, typed as `any`:

```tsx
const foo: any = false;

// Automatically fixed to:
const foo: boolean = false;
```

Assignment of an array literal, typed as `any`:

```tsx
const foo: any = [];

// Automatically fixed to:
const foo: any[] = [];
```

### Correct ✅

Assignment of a number literal, typed as `number`:

```tsx
const foo: number = 42;
```

Assignment of a string literal, with inferred type:

```tsx
const foo = 'ok';
```

Assignment of an array literal, typed as `any[]`:

```tsx
const foo: any[] = [];
```

<!-- end auto-generated rule header -->

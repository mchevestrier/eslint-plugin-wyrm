# wyrm/inner-as-const

📝 Enforce setting `as const` on the outermost object/array literal only.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

`as const` is set on all array elements:

```tsx
const arr = [42 as const, 105 as const];

// Automatically fixed to:
const arr = [42, 105] as const;
```

`as const` is set on some array elements:

```tsx
const arr = [42, 105 as const];

// Automatically fixed to:
const arr = [42, 105] as const;
```

`as const` is set on some array elements and on the array:

```tsx
const arr = [42, 105 as const] as const;

// Automatically fixed to:
const arr = [42, 105] as const;
```

`as const` is set on all array elements and on the array:

```tsx
const arr = [42 as const, 105 as const] as const;

// Automatically fixed to:
const arr = [42, 105] as const;
```

`as const` is set on all object properties:

```tsx
const obj = { foo: 42 as const, bar: 105 as const };

// Automatically fixed to:
const obj = { foo: 42, bar: 105 } as const;
```

`as const` is set on some object properties:

```tsx
const obj = { foo: 42, bar: 105 as const };

// Automatically fixed to:
const obj = { foo: 42, bar: 105 } as const;
```

`as const` is set on some object properties and on the object:

```tsx
const obj = { foo: 42, bar: 105 as const } as const;

// Automatically fixed to:
const obj = { foo: 42, bar: 105 } as const;
```

`as const` is set on all object properties and on the object:

```tsx
const obj = { foo: 42 as const, bar: 105 as const } as const;

// Automatically fixed to:
const obj = { foo: 42, bar: 105 } as const;
```

### Correct ✅

`as const` is set on the outermost array:

```tsx
const arr = [42, 105] as const;
```

`as const` is set on the outermost object:

```tsx
const obj = { foo: 42, bar: 105 } as const;
```

<!-- end auto-generated rule header -->

# wyrm/no-convoluted-boolean-expressions

📝 Forbid simplifiable logical expressions with boolean types.

💼 This rule is enabled in the following configs: ✅ `recommendedTypeChecked`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Convoluted boolean XOR:

```tsx
function foo(x: boolean, y: boolean) {
  return (x || y) && !(x && y);
}

// Automatically fixed to:
function foo(x: boolean, y: boolean) {
  return x !== y;
}
```

Convoluted boolean XOR, with distributed negation:

```tsx
function foo(x: boolean, y: boolean) {
  return (x || y) && (!x || !y);
}

// Automatically fixed to:
function foo(x: boolean, y: boolean) {
  return x !== y;
}
```

Convoluted boolean OR (XOR || AND):

```tsx
function foo(x: boolean, y: boolean) {
  return x !== y || (x && y);
}

// Automatically fixed to:
function foo(x: boolean, y: boolean) {
  return x || y;
}
```

Convoluted boolean OR:

```tsx
function foo(x: boolean, y: boolean) {
  return ((x || y) && !(x && y)) || (x && y);
}

// Automatically fixed to:
function foo(x: boolean, y: boolean) {
  return x || y;
}
```

### Correct ✅

Simple boolean XOR:

```tsx
function foo(x: boolean, y: boolean) {
  return x !== y;
}
```

Simple boolean OR:

```tsx
function foo(x: boolean, y: boolean) {
  return x || y;
}
```

Simple boolean AND:

```tsx
function foo(x: boolean, y: boolean) {
  return x && y;
}
```

<!-- end auto-generated rule header -->

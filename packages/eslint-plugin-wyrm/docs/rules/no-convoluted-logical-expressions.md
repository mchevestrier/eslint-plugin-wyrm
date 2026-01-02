# wyrm/no-convoluted-logical-expressions

📝 Forbid simplifiable logical expressions.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Tautology (disjunction):

```tsx
const x = foo || foo;

// Automatically fixed to:
const x = foo;
```

Tautology (conjunction):

```tsx
const x = foo && foo;

// Automatically fixed to:
const x = foo;
```

Tautology (nullish coalescing):

```tsx
const x = foo ?? foo;

// Automatically fixed to:
const x = foo;
```

Absorption law: `A || (A && B) === A`:

```tsx
const x = foo || (foo && bar);

// Automatically fixed to:
const x = foo;
```

Absorption law: `A && (A || B) === A`:

```tsx
const x = foo && (foo || bar);

// Automatically fixed to:
const x = foo;
```

Disjunction with distributed conjunctions:

```tsx
const x = (foo && bar) || (foo && baz);

// Automatically fixed to:
const x = foo && (bar || baz);
```

Conjunction with distributed disjunctions:

```tsx
const x = (foo || bar) && (foo || baz);

// Automatically fixed to:
const x = foo || (bar && baz);
```

Nullish fallback to ternary condition with reverse test:

```tsx
const x = (quux ? foo : null) ?? (!quux ? bar : null);

// Automatically fixed to:
const x = quux ? (foo ?? null) : bar;
```

### Correct ✅

No possible simplification:

```tsx
const x = quux ? (foo ?? null) : bar;
```

<!-- end auto-generated rule header -->

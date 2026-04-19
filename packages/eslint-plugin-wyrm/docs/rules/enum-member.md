# wyrm/enum-member

📝 Prefer enum members to string literals asserted as enum.

💼 This rule is enabled in the following configs: ✅ `recommendedTypeChecked`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

With a string literal and a type assertion:

```tsx
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

const fnord = 'bar' as FooEnum;

// Automatically fixed to:
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

const fnord = FooEnum.BAR;
```

With a number literal and a type assertion:

```tsx
enum FooEnum {
  BAR = 12,
  QUUX = 25,
}

const fnord = 25 as FooEnum;

// Automatically fixed to:
enum FooEnum {
  BAR = 12,
  QUUX = 25,
}

const fnord = FooEnum.QUUX;
```

### Correct ✅

Using an enum member:

```tsx
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

export const fnord = FooEnum.BAR;
```

With a string literal not part of enum values and a type assertion:

```tsx
enum FooEnum {
  BAR = 'bar',
  QUUX = 'quux',
}

const fnord = 'fnord' as FooEnum;
```

With a number literal not part of enum values and a type assertion:

```tsx
enum FooEnum {
  BAR = 12,
  QUUX = 25,
}

const fnord = 42 as FooEnum;
```

<!-- end auto-generated rule header -->

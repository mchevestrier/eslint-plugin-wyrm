# wyrm/useless-required

📝 Forbid unnecessary use of `Required<T>` and `Partial<T>`.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

`Required<T>` with a reference to a type with no optional property:

```tsx
type Foo = { quux: string | undefined };

type Bar = Required<Foo>;

// Can be fixed to:
type Foo = { quux: string | undefined };

type Bar = Foo;
```

`Partial<T>` with a type literal with no required property:

```tsx
type Foo = Partial<{ quux?: string | undefined }>;

// Can be fixed to:
type Foo = { quux?: string | undefined };
```

### Correct ✅

`Required<T>` with a reference to a type with some optional properties:

```tsx
type Foo = {
  quux?: string | undefined;
  bar: number;
  quux: number | undefined;
};

type Bar = Required<Foo>;
```

`Partial<T>` with a reference to a type with some required properties:

```tsx
type Foo = {
  quux?: string | undefined;
  bar: number;
  quux: number | undefined;
};

type Bar = Partial<Foo>;
```

<!-- end auto-generated rule header -->

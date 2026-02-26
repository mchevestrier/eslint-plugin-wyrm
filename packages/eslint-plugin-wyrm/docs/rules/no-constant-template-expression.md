# wyrm/no-constant-template-expression

📝 Disallow constant string expressions in template literals.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Description

It is sometimes clearer to inline interpolated expressions when their values are constant:

**Example:**

```ts
const foo = 'foobar';
const str = `${foo}_baz`;
// This would be clearer as:
const str = 'foobar_baz';
```

By default, this rule allows constant values when they take up at least 10 characters.
This can be configured with the `minAllowedLength` option.

## Cases

### Incorrect ❌

Template expression with a constant string value:

```tsx
const foo = 'foobar';
const str = `${foo}_baz`;

// Can be fixed to:
const foo = 'foobar';
const str = `foobar_baz`;
```

Template expression with a constant boolean value:

```tsx
const bool = true;
const str = `${bool}_baz`;

// Can be fixed to:
const bool = true;
const str = `true_baz`;
```

With a 14 character string (`minAllowedLength: 15`):

```tsx
const foo = 'abcdefghijklmn';
const str = `${foo}_baz`;

// Can be fixed to:
const foo = 'abcdefghijklmn';
const str = `abcdefghijklmn_baz`;
```

### Correct ✅

Template expression typed as string:

```tsx
declare const foo: string;
const str = `${foo}_baz`;
```

Template expression with a constant number value:

```tsx
const n = 42;
const str = `${n}_baz`;
```

Template expression with a 10 character string value (as long as the default `minAllowedLength` value):

```tsx
const n = 'aaaaaaaaaa';
const str = `${n}_baz`;
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name               | Description                                                         | Type   |
| :----------------- | :------------------------------------------------------------------ | :----- |
| `minAllowedLength` | Minimum string length allowed for constant expressions. Default: 10 | Number |

<!-- end auto-generated rule options list -->

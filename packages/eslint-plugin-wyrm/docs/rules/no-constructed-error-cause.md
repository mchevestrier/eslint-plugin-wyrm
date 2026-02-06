# wyrm/no-constructed-error-cause

📝 Forbid using `Error.cause` with constructed objects.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

The `Error.cause` property is used to wrap a previously caught error in a new instantiated error:

```ts
try {
  // ...
} catch (err) {
  throw Error('New error message', { cause: err });
}
```

But sometimes it can also be used as a way to store additional information on `Error` objects:

```ts
throw Error('Division by zero', { cause: { code: 'division_by_zero' } });
```

This second pattern is what this rule forbids. Custom errors should be used instead:

```ts
class ZeroDivisionError extends Error {
  public override message = 'Division by zero';
  public code = 'division_by_zero';
}

throw new ZeroDivisionError();
```

## Cases

### Incorrect ❌

Error cause is an object literal:

```tsx
new Error('foo', { cause: { message: 'bar' } });
```

Error cause is a new instantiated error:

```tsx
Error('foo', { cause: new Error('bar') });
```

### Correct ✅

Error cause is an identifier:

```tsx
new Error('foo', { cause: err });
```

Custom error:

```tsx
new QuuxError('foo', { cause: { key: 'ok' }, data: null });
```

<!-- end auto-generated rule header -->

# wyrm/no-useless-use-strict

📝 Forbid useless "use strict" directives.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`'use strict'` directive in TS file:

```tsx
// File name: file.ts

'use strict';
```

`'use strict'` directive in ESM file:

```tsx
// File name: file.mjs

'use strict';
```

`'use strict'` directive in class constructor:

```tsx
// File name: file.cjs

class Klass {
  constructor() {
    'use strict';
  }
}
```

### Correct ✅

`'use strict'` directive in CJS file:

```tsx
// File name: file.cjs

'use strict';
```

<!-- end auto-generated rule header -->

## Related

- ESLint: [`strict`](https://eslint.org/docs/latest/rules/strict)
- [`unicorn/prefer-module`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-module.md)

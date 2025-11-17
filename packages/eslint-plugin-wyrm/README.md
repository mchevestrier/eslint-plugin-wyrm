# 🐲 eslint-plugin-wyrm

[![npm version](https://img.shields.io/npm/v/eslint-plugin-wyrm.svg?color=7f52af&labelColor=26272b)](https://www.npmjs.com/package/eslint-plugin-wyrm)
[![GitHub release](https://img.shields.io/github/v/release/mchevestrier/eslint-plugin-wyrm?color=7f52af&labelColor=26272b)](https://github.com/mchevestrier/eslint-plugin-wyrm/releases/latest)
[![GitHub License](https://img.shields.io/badge/license-MIT-232428.svg?color=7f52af&labelColor=26272b)](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/LICENSE.md)

## Installation

```shell
npm install --save-dev eslint eslint-plugin-wyrm
```

## Usage

```ts
import { defineConfig } from 'eslint/config';
import wyrm from 'eslint-plugin-wyrm';

export default defineConfig([
  // ...

  wyrm.configs.recommended,
]);
```

## Configs

<!-- begin auto-generated configs list -->

|     | Name                     |
| :-- | :----------------------- |
| 🟩  | `recommended`            |
| ✅  | `recommendedTypeChecked` |
| 🟪  | `strict`                 |
| ☑️  | `strictTypeChecked`      |

<!-- end auto-generated configs list -->

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
🟩 Set in the `recommended` configuration.\
✅ Set in the `recommendedTypeChecked` configuration.\
🟪 Set in the `strict` configuration.\
☑️ Set in the `strictTypeChecked` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).

| Name                                                                                                                                                                        | Description                                                               | 💼          | 🔧  | 💡  | 💭  |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :---------- | :-- | :-- | :-- |
| [distribute-boolean-casts](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/distribute-boolean-casts.md)               | Enforce that boolean casts are distributed over logical expressions       | 🟪 ☑️       | 🔧  |     |     |
| [no-constant-template-expression](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-constant-template-expression.md) | Disallow constant string expressions in template literals                 | ☑️          |     | 💡  | 💭  |
| [no-duplicated-return](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-duplicated-return.md)                       | Forbid duplicated branches with early returns                             | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-else-break](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-break.md)                                     | Forbid unnecessary `else` block after a `break` statement                 | 🟩 ✅ 🟪 ☑️ | 🔧  |     |     |
| [no-else-continue](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-continue.md)                               | Forbid unnecessary `else` block after a `continue` statement              | 🟩 ✅ 🟪 ☑️ | 🔧  |     |     |
| [no-else-throw](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-throw.md)                                     | Forbid unnecessary `else` block after a `throw` statement                 | 🟩 ✅ 🟪 ☑️ | 🔧  |     |     |
| [no-empty-comment](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-empty-comment.md)                               | Forbid empty comments                                                     | 🟪 ☑️       |     |     |     |
| [no-empty-jsx-expression](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-empty-jsx-expression.md)                 | Forbid empty JSX expression containers                                    | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-extra-false-fallback](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-extra-false-fallback.md)                 | Forbid extra `?? false` in conditions and predicates                      | 🟪 ☑️       |     | 💡  |     |
| [no-extra-nested-boolean-cast](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-extra-nested-boolean-cast.md)       | Forbid extra boolean casts in conditions and predicates                   | 🟪 ☑️       |     |     |     |
| [no-first-last](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-first-last.md)                                     | Forbid confusing naming for "first" or "last"                             | 🟩 ✅ 🟪 ☑️ | 🔧  |     |     |
| [no-invalid-date-literal](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-invalid-date-literal.md)                 | Disallow invalid date literals                                            | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-jsx-statement](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-jsx-statement.md)                               | Forbid JSX expression statements                                          | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-optional-type-guard-param](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-optional-type-guard-param.md)       | Forbid optional parameters in type guards                                 | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-return-to-void](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-return-to-void.md)                             | Forbid returning values in void-returning callbacks                       | ☑️          |     |     | 💭  |
| [no-sloppy-length-check](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-sloppy-length-check.md)                   | Forbid sloppy collection size checks                                      | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-suspicious-jsx-semicolon](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-suspicious-jsx-semicolon.md)         | Forbid suspicious semicolons in JSX                                       | 🟩 ✅ 🟪 ☑️ |     |     |     |
| [no-ternary-return](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-ternary-return.md)                             | Disallow ternary conditions in return statements                          | 🟪 ☑️       | 🔧  |     |     |
| [no-useless-iife](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-useless-iife.md)                                 | Forbid useless IIFEs                                                      | 🟩 ✅ 🟪 ☑️ |     | 💡  |     |
| [no-useless-logical-fallback](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-useless-logical-fallback.md)         | Forbid useless fallback values for logical expressions                    | ✅ ☑️       |     | 💡  | 💭  |
| [no-useless-return-undefined](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-useless-return-undefined.md)         | Forbid returning `undefined` in void-returning callbacks                  | ☑️          |     |     | 💭  |
| [no-useless-usememo](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-useless-usememo.md)                           | Forbid useless `useMemo()`                                                | 🟪 ☑️       |     |     |     |
| [no-whitespace-property](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-whitespace-property.md)                   | Forbid leading or trailing whitespace in object keys                      | 🟪 ☑️       |     |     |     |
| [prefer-catch-method](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/prefer-catch-method.md)                         | Enforce usage of `Promise.prototype.catch()` when it improves readability | 🟩 ✅ 🟪 ☑️ |     | 💡  |     |
| [prefer-early-return](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/prefer-early-return.md)                         | Require early returns when possible                                       | 🟪 ☑️       | 🔧  |     |     |
| [prefer-repeat](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/prefer-repeat.md)                                     | Enforce usage of `String.prototype.repeat`                                | 🟩 ✅ 🟪 ☑️ |     | 💡  |     |
| [unsafe-asserted-chain](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/unsafe-asserted-chain.md)                     | Disallow unsafe type assertions on optional chained expressions           | ☑️          |     |     | 💭  |

<!-- end auto-generated rules list -->

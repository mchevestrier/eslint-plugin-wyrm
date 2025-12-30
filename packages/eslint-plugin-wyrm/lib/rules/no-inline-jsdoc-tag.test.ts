import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-inline-jsdoc-tag.js';

const ruleTester = new RuleTester({
  plugins: { markdown: markdownPlugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`@deprecated` JSDoc tag in valid JSDoc comment #docs',
      code: `
/** @deprecated Use the haptic hard drive instead */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@deprecated` JSDoc tag in valid JSDoc comment (multiline)',
      code: `
/**
 * @deprecated Use the haptic hard drive instead
 */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Deprecated comment with no JSDoc tag #docs',
      code: `
// Deprecated: Use the open-source TLS capacitor, then you can hack the redundant sensor
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment with no JSDoc tag #docs',
      code: `
// TODO: You can't index the bus without quantifying the neural AGP program
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Non-standard JSDoc tag',
      code: `
// @johndoe needs to hack the bluetooth SMTP protocol
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@foobar` JSDoc tag',
      code: `
// @foobar
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@foobar` JSDoc tag in valid JSDoc comment',
      code: `
/** @foobar */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSDoc tag but not in start position',
      code: `
// We should mark this as @deprecated soon
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSDoc tag but not in start position, with asterisks',
      code: `
// ***** @summary *****
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a JSDoc tag, with asterisk inside',
      code: `
// @*summary
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
{
  /** @deprecated */
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a YAML file',
      filename: 'foo.yml',
      languageOptions: {
        parser: yamlParser,
      },
      code: `
# No JSDoc here
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a Markdown file',
      filename: 'foo.md',
      // 'language' is not supported by typings, but still transmitted
      // @ts-expect-error - 'language' does not exist in type 'ValidTestCase'
      language: 'markdown/commonmark',
      code: `
# @deprecated
<!-- @deprecated -->
`,
      after() {
        // Not formatted
      },
    },
    {
      name: '`// @ts-check` #docs',
      code: `
// @ts-check
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`// @ts-ignore`',
      code: `
// @ts-ignore
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`// @ts-expect-error`',
      code: `
// @ts-expect-error
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`// @flow`',
      code: `
// @flow
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`// @flow strict`',
      code: `
// @flow strict
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`/* @flow */`',
      code: `
/* @flow */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`/** @flow */`',
      code: `
/** @flow */
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`@type` JSDoc tag in line comment #docs',
      code: `
// @type {string}
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@fileoverview` JSDoc tag in single line block comment #docs',
      code: `
/* @fileoverview */
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@param` JSDoc tag in multiline block comment #docs',
      code: `
/*
 * @param {string} foo
 */
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@TODO` comment in line comment #docs',
      code: `
// @TODO: You can't index the bus without quantifying the neural AGP program
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@TODO` comment in line comment with details',
      code: `
// @TODO(foo): You can't index the bus without quantifying the neural AGP program
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@description` comment in line comment, with leading asterisk',
      code: `
// * @description
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@description` comment in line comment, with leading asterisk and no leading space',
      code: `
//* @description
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@private` JSDoc tag in multiline block comment',
      code: `
/*
 * @private
 */
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@public` JSDoc tag in multiline block comment (with trailing white space)',
      code: `
/*
 * @public 
 */
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        // Not formatted
      },
    },
    {
      name: '`@protected` JSDoc tag in multiline block comment (with no leading asterisk)',
      code: `
/*
 @protected
 */
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@see` JSDoc tag in trailing single line comment',
      code: `
const foo = 'bar'; // @see https://example.com
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@readonly` with trailing period',
      code: `
// @readonly. Readonly
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
{
  // @deprecated
}
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a YAML file',
      filename: 'foo.yml',
      languageOptions: {
        parser: yamlParser,
      },
      code: `
# @deprecated
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        // Not formatted
      },
    },
    {
      name: '`@foobar` JSDoc tag (in `options.tags`)',
      options: [{ tags: ['foobar'] }],
      code: `
// @foobar
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },

    // Supported JSDoc tags

    {
      name: '`@abstract` JSDoc tag',
      code: `
// @abstract
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@access` JSDoc tag',
      code: `
// @access
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@alias` JSDoc tag',
      code: `
// @alias
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@arg` JSDoc tag',
      code: `
// @arg
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@argument` JSDoc tag',
      code: `
// @argument
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@async` JSDoc tag',
      code: `
// @async
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@augments` JSDoc tag',
      code: `
// @augments
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@author` JSDoc tag',
      code: `
// @author
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@borrows` JSDoc tag',
      code: `
// @borrows
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@callback` JSDoc tag',
      code: `
// @callback
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@class` JSDoc tag',
      code: `
// @class
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@classdesc` JSDoc tag',
      code: `
// @classdesc
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@const` JSDoc tag',
      code: `
// @const
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@constant` JSDoc tag',
      code: `
// @constant
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@constructor` JSDoc tag',
      code: `
// @constructor
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@constructs` JSDoc tag',
      code: `
// @constructs
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@copyright` JSDoc tag',
      code: `
// @copyright
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@default` JSDoc tag',
      code: `
// @default
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@defaultvalue` JSDoc tag',
      code: `
// @defaultvalue
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@deprecated` JSDoc tag',
      code: `
// @deprecated
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@desc` JSDoc tag',
      code: `
// @desc
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@description` JSDoc tag',
      code: `
// @description
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@emits` JSDoc tag',
      code: `
// @emits
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@enum` JSDoc tag',
      code: `
// @enum
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@event` JSDoc tag',
      code: `
// @event
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@example` JSDoc tag',
      code: `
// @example
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@exception` JSDoc tag',
      code: `
// @exception
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@exports` JSDoc tag',
      code: `
// @exports
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@extends` JSDoc tag',
      code: `
// @extends
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@external` JSDoc tag',
      code: `
// @external
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@file` JSDoc tag',
      code: `
// @file
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@fileoverview` JSDoc tag',
      code: `
// @fileoverview
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@fires` JSDoc tag',
      code: `
// @fires
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@func` JSDoc tag',
      code: `
// @func
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@function` JSDoc tag',
      code: `
// @function
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@generator` JSDoc tag',
      code: `
// @generator
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@global` JSDoc tag',
      code: `
// @global
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@hideconstructor` JSDoc tag',
      code: `
// @hideconstructor
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@host` JSDoc tag',
      code: `
// @host
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@ignore` JSDoc tag',
      code: `
// @ignore
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@implements` JSDoc tag',
      code: `
// @implements
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@import` JSDoc tag',
      code: `
// @import
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@inheritdoc` JSDoc tag',
      code: `
// @inheritdoc
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@inner` JSDoc tag',
      code: `
// @inner
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@instance` JSDoc tag',
      code: `
// @instance
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@interface` JSDoc tag',
      code: `
// @interface
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@internal` JSDoc tag',
      code: `
// @internal
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@kind` JSDoc tag',
      code: `
// @kind
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@lends` JSDoc tag',
      code: `
// @lends
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@license` JSDoc tag',
      code: `
// @license
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@link` JSDoc tag',
      code: `
// @link
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@listens` JSDoc tag',
      code: `
// @listens
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@member` JSDoc tag',
      code: `
// @member
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@memberof` JSDoc tag',
      code: `
// @memberof
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@method` JSDoc tag',
      code: `
// @method
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@mixes` JSDoc tag',
      code: `
// @mixes
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@mixin` JSDoc tag',
      code: `
// @mixin
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@module` JSDoc tag',
      code: `
// @module
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@name` JSDoc tag',
      code: `
// @name
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@namespace` JSDoc tag',
      code: `
// @namespace
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@override` JSDoc tag',
      code: `
// @override
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@overview` JSDoc tag',
      code: `
// @overview
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@package` JSDoc tag',
      code: `
// @package
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@param` JSDoc tag',
      code: `
// @param
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@private` JSDoc tag',
      code: `
// @private
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@prop` JSDoc tag',
      code: `
// @prop
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@property` JSDoc tag',
      code: `
// @property
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@protected` JSDoc tag',
      code: `
// @protected
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@public` JSDoc tag',
      code: `
// @public
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@readonly` JSDoc tag',
      code: `
// @readonly
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@requires` JSDoc tag',
      code: `
// @requires
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@return` JSDoc tag',
      code: `
// @return
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@returns` JSDoc tag',
      code: `
// @returns
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@satisfies` JSDoc tag',
      code: `
// @satisfies
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@see` JSDoc tag',
      code: `
// @see
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@since` JSDoc tag',
      code: `
// @since
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@static` JSDoc tag',
      code: `
// @static
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@summary` JSDoc tag',
      code: `
// @summary
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@template` JSDoc tag',
      code: `
// @template
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@this` JSDoc tag',
      code: `
// @this
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@throws` JSDoc tag',
      code: `
// @throws
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@todo` JSDoc tag',
      code: `
// @todo
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@tutorial` JSDoc tag',
      code: `
// @tutorial
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@type` JSDoc tag',
      code: `
// @type
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@typedef` JSDoc tag',
      code: `
// @typedef
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@var` JSDoc tag',
      code: `
// @var
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@variation` JSDoc tag',
      code: `
// @variation
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@version` JSDoc tag',
      code: `
// @version
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@virtual` JSDoc tag',
      code: `
// @virtual
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@yield` JSDoc tag',
      code: `
// @yield
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@yields` JSDoc tag',
      code: `
// @yields
`,
      errors: [{ messageId: 'noInlineJsDocTags' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});

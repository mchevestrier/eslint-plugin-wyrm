import path from 'node:path';

import { AST_TOKEN_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_ADDITIONAL_JSDOC_TAGS: string[] = [];

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid JSDoc tags in code comments',
      strict: true,
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          tags: {
            type: 'array',
            description: `Additional JSDoc tags to check. Default: \`${JSON.stringify(DEFAULT_ADDITIONAL_JSDOC_TAGS)}\``,
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      noInlineJsDocTags:
        'This looks like a JSDoc tag, but it has no effect as this is not a JSDoc comment.',
    },
  },
  defaultOptions: [{ tags: DEFAULT_ADDITIONAL_JSDOC_TAGS }],
  create(context, [options]) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();

    const tags = [...getJsDocTags(), ...options.tags];

    function hasJsDocTag(commentValue: string) {
      return commentValue.split(/\n|\r|\r\n/u).some((line) => lineHasJsDocTag(line));
    }

    function lineHasJsDocTag(line: string) {
      const value = line.trim().replace(/^\*/u, '').trim().toLowerCase();
      return tags.some(
        (tag) =>
          value.startsWith(`@${tag} `) ||
          value.startsWith(`@${tag}:`) ||
          value.startsWith(`@${tag}.`) ||
          value.startsWith(`@${tag}(`) ||
          value === `@${tag}`,
      );
    }

    for (const comment of comments) {
      if (isJsDocComment(comment)) continue;

      if (!hasJsDocTag(comment.value)) continue;

      context.report({
        node: comment,
        messageId: 'noInlineJsDocTags',
      });
    }

    return {};
  },
});

function isJsDocComment(comment: TSESTree.Comment) {
  if (comment.type === AST_TOKEN_TYPES.Line) return false;
  return comment.value.startsWith('*');
}

/**
 * @see https://jsdoc.app/#block-tags
 * @see https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */
function getJsDocTags() {
  return [
    'abstract',
    'access',
    'alias',
    'arg',
    'argument',
    'async',
    'augments',
    'author',
    'borrows',
    'callback',
    'class',
    'classdesc',
    'const',
    'constant',
    'constructor',
    'constructs',
    'copyright',
    'default',
    'defaultvalue',
    'deprecated',
    'desc',
    'description',
    'emits',
    'enum',
    'event',
    'example',
    'exception',
    'exports',
    'extends',
    'external',
    'file',
    'fileoverview',
    'fires',
    'func',
    'function',
    'generator',
    'global',
    'hideconstructor',
    'host',
    'ignore',
    'implements',
    'import',
    'inheritdoc',
    'inner',
    'instance',
    'interface',
    'internal',
    'kind',
    'lends',
    'license',
    'link',
    'listens',
    'member',
    'memberof',
    'method',
    'mixes',
    'mixin',
    'module',
    'name',
    'namespace',
    'override',
    'overview',
    'package',
    'param',
    'private',
    'prop',
    'property',
    'protected',
    'public',
    'readonly',
    'requires',
    'return',
    'returns',
    'satisfies',
    'see',
    'since',
    'static',
    'summary',
    'template',
    'this',
    'throws',
    'todo',
    'tutorial',
    'type',
    'typedef',
    'var',
    'variation',
    'version',
    'virtual',
    'yield',
    'yields',
  ];
}

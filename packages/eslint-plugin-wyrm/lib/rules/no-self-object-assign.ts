import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid using `Object.assign()` with the same object as both target and source',
      recommended: true,
    },
    schema: [],
    messages: {
      noSelfObjectAssign:
        '`Object.assign()` is called with the same object as both target and source',
      noDuplicateSources: '`Object.assign()` is called with the same duplicated source',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (node.callee.object.name !== 'Object') return;
        if (node.callee.property.name !== 'assign') return;

        const [target, ...sources] = node.arguments;
        const sourcesNames = sources
          .filter((src) => src.type === AST_NODE_TYPES.Identifier)
          .map((src) => [src.name, src] as const);
        const duplicates = getDuplicateEntries(sourcesNames);

        for (const duplicate of duplicates) {
          context.report({ node: duplicate, messageId: 'noDuplicateSources' });
        }

        if (!target) return;
        if (target.type !== AST_NODE_TYPES.Identifier) return;

        const targetAsSource = new Map(sourcesNames).get(target.name);
        if (!targetAsSource) return;
        context.report({ node: targetAsSource, messageId: 'noSelfObjectAssign' });
      },
    };
  },
});

function getDuplicateEntries<U>(entries: ReadonlyArray<readonly [unknown, U]>): U[] {
  const seen = new Set();
  const duplicates: U[] = [];

  for (const [k, v] of entries) {
    if (seen.has(k)) {
      duplicates.push(v);
    } else {
      seen.add(k);
    }
  }

  return duplicates;
}

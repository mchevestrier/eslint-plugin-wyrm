import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_ALLOW_MULTI_LINE = true;

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce directly returning a value instead of assigning it first to a variable',
      strict: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowMultiLine: {
            type: 'boolean',
            description: `Whether to allow assigning multi-line expressions before returning. Default: \`${DEFAULT_ALLOW_MULTI_LINE}\``,
          },
        },
      },
    ],
    messages: {
      uselessAssign: 'Directly return the value instead of declaring a variable first',
    },
  },
  defaultOptions: [{ allowMultiLine: DEFAULT_ALLOW_MULTI_LINE }],
  create(context, [options]) {
    return {
      VariableDeclarator(node) {
        if (node.parent.kind !== 'let' && node.parent.kind !== 'const') return;

        if (node.parent.parent.type !== AST_NODE_TYPES.BlockStatement) return;

        const block = node.parent.parent;
        const idx = block.body.indexOf(node.parent);
        const nextNeighbor = block.body.at(idx + 1);
        if (!nextNeighbor) return;
        if (nextNeighbor.type !== AST_NODE_TYPES.ReturnStatement) return;
        if (!nextNeighbor.argument) return;
        if (nextNeighbor.argument.type !== AST_NODE_TYPES.Identifier) return;
        const ident = nextNeighbor.argument;

        if (node.id.type !== AST_NODE_TYPES.Identifier) return;
        if (node.id.name !== ident.name) return;
        if (!node.init) return;

        const value = node.init;

        const isMultiLine = value.loc.start.line !== value.loc.end.line;
        if (isMultiLine && options.allowMultiLine) return;

        context.report({
          node,
          messageId: 'uselessAssign',
          *fix(fixer) {
            const txt = context.sourceCode.getText(value);
            yield fixer.replaceText(nextNeighbor, `return ${txt};`);

            if (node.parent.declarations.length === 1) {
              yield fixer.remove(node.parent);
              return;
            }

            // Preserve multiple inline declarations
            yield fixer.remove(node);

            const declIndex = node.parent.declarations.findIndex((d) => d.id === node.id);
            if (declIndex === 0) {
              const commaToken = context.sourceCode.getTokenAfter(node);
              /* v8 ignore else -- @preserve */
              if (commaToken) yield fixer.remove(commaToken);
              return;
            }

            const commaToken = context.sourceCode.getTokenBefore(node);
            /* v8 ignore else -- @preserve */
            if (commaToken) yield fixer.remove(commaToken);
          },
        });
      },
    };
  },
});

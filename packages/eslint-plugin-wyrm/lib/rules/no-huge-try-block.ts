import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_MAX_TRY_LINES = 20;
const DEFAULT_MAX_CATCH_LINES = Infinity;
const DEFAULT_MAX_FINALLY_LINES = Infinity;

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid huge try/catch blocks',
      strict: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxTryLines: {
            type: 'number',
            description: `Maximum number of lines for a \`try\` block. Default: \`${DEFAULT_MAX_TRY_LINES}\``,
          },
          maxCatchLines: {
            type: 'number',
            description: `Maximum number of lines for a \`catch\` block. Default: \`${DEFAULT_MAX_CATCH_LINES}\``,
          },
          maxFinallyLines: {
            type: 'number',
            description: `Maximum number of lines for a \`finally\` block. Default: \`${DEFAULT_MAX_FINALLY_LINES}\``,
          },
        },
      },
    ],
    messages: {
      noHugeTryBlock:
        'This `try` block spans more than {{ maxNbLines }} lines. Refactor to avoid huge blocks of error handling code.',
      noHugeCatchBlock:
        'This `catch` block spans more than {{ maxNbLines }} lines. Refactor to avoid huge blocks of error handling code.',
      noHugeFinallyBlock:
        'This `finally` block spans more than {{ maxNbLines }} lines. Refactor to avoid huge blocks of error handling code.',
    },
  },
  defaultOptions: [
    {
      maxTryLines: DEFAULT_MAX_TRY_LINES,
      maxCatchLines: DEFAULT_MAX_CATCH_LINES,
      maxFinallyLines: DEFAULT_MAX_FINALLY_LINES,
    },
  ],
  create(context, [options]) {
    return {
      TryStatement(node) {
        const nbTryLines = node.block.loc.end.line - node.block.loc.start.line + 1;
        if (nbTryLines > options.maxTryLines) {
          context.report({
            node: node.block,
            messageId: 'noHugeTryBlock',
            data: { maxNbLines: options.maxTryLines },
          });
        }

        if (node.handler) {
          const nbCatchLines =
            node.handler.loc.end.line - node.handler.loc.start.line + 1;
          if (nbCatchLines > options.maxCatchLines) {
            context.report({
              node: node.handler,
              messageId: 'noHugeCatchBlock',
              data: { maxNbLines: options.maxCatchLines },
            });
          }
        }

        if (node.finalizer) {
          const nbFinallyLines =
            node.finalizer.loc.end.line - node.finalizer.loc.start.line + 1;
          if (nbFinallyLines > options.maxFinallyLines) {
            context.report({
              node: node.finalizer,
              messageId: 'noHugeFinallyBlock',
              data: { maxNbLines: options.maxFinallyLines },
            });
          }
        }
      },
    };
  },
});

import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using `finally` rather than duplicating code in `try` and `catch` blocks',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferFinally: 'Use `finally` instead of duplicating code in both branches',
      useFinally: 'Use `finally` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TryStatement(node) {
        if (!node.handler) return;

        const lastTryStatement = node.block.body.at(-1);
        const lastHandlerStatement = node.handler.body.body.at(-1);

        if (!lastTryStatement || !lastHandlerStatement) return;

        if (node.block.body.length <= 1) return;
        if (node.handler.body.body.length <= 1) return;

        const lastTryStatementText = context.sourceCode.getText(lastTryStatement);
        const lastHandlerStatementText = context.sourceCode.getText(lastHandlerStatement);

        if (lastTryStatementText !== lastHandlerStatementText) return;

        context.report({
          node,
          messageId: 'preferFinally',
          suggest: [
            {
              messageId: 'useFinally',
              *fix(fixer) {
                yield fixer.remove(lastTryStatement);
                yield fixer.remove(lastHandlerStatement);
                const indent = ' '.repeat(node.loc.start.column);

                if (node.finalizer) {
                  const firstToken = context.sourceCode.getFirstToken(node.finalizer);
                  /* v8 ignore if -- @preserve */
                  if (!firstToken) return;
                  yield fixer.insertTextAfter(
                    firstToken,
                    `\n${indent}  ${lastTryStatementText}`,
                  );
                } else {
                  yield fixer.insertTextAfter(
                    node,
                    ` finally {
${indent}  ${lastTryStatementText}
${indent}}`,
                  );
                }
              },
            },
          ],
        });
      },
    };
  },
});

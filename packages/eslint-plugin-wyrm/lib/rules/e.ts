/**
 * @fileoverview
 *
 * In JS, the parameter name `e` is semantically overloaded: it is often used for errors, events, elements...
 * This rule forbids using `e` as a parameter name, in favor of more explicit identifiers like `err`, `evt` or `elt`.
 */

import path from 'node:path';

import { AST_NODE_TYPES, ASTUtils, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_ALTERNATIVES = ['err', 'evt', 'elt'];

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid using `e` as a parameter name',
      strict: true,
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          alternatives: {
            description: `Suggested alternatives for identifier names. Default: \`${JSON.stringify(DEFAULT_ALTERNATIVES)}\``,
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      noE: 'Do not use `e` as a parameter name. Use a less ambiguous name.',
      useOther: 'Use `{{ ident }}` instead',
    },
  },
  defaultOptions: [{ alternatives: DEFAULT_ALTERNATIVES }],
  create(context, [options]) {
    return {
      ArrowFunctionExpression: checkFunction,
      FunctionExpression: checkFunction,
      FunctionDeclaration: checkFunction,
      CatchClause(node) {
        if (node.param?.type !== AST_NODE_TYPES.Identifier) return;
        checkParam(node.param);
      },
    };

    type FunctionNode =
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression;

    function checkFunction(node: FunctionNode) {
      for (const param of node.params) {
        if (param.type !== AST_NODE_TYPES.Identifier) return;
        checkParam(param);
      }
    }

    function checkParam(param: TSESTree.Identifier) {
      if (param.name !== 'e') return;

      const scope = context.sourceCode.getScope(param);
      const variable = ASTUtils.findVariable(scope, param);
      if (!variable) return;

      const { alternatives } = options;

      context.report({
        node: param,
        messageId: 'noE',
        suggest: alternatives.map((alternative) => ({
          messageId: 'useOther',
          data: { ident: alternative },
          *fix(fixer) {
            for (const ref of variable.references) {
              yield fixer.replaceText(ref.identifier, alternative);
            }

            if (param.typeAnnotation) {
              const rng = [param.range[0], param.typeAnnotation.range[0]] as const;
              yield fixer.replaceTextRange(rng, alternative);
              return;
            }

            yield fixer.replaceText(param, alternative);
          },
        })),
      });
    }
  },
});

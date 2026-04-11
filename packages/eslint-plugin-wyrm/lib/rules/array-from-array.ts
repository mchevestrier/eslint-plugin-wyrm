import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type { ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import type ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid calling `Array.from` on arrays',
      strict: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noArrayFromArray:
        '`Array.from` should only be used on iterables. Use spread syntax to copy plain arrays.',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    let checker: ts.TypeChecker | undefined;
    function getChecker() {
      checker ??= getServices().program.getTypeChecker();
      return checker;
    }

    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.object.name !== 'Array') return;
        if (node.callee.property.name !== 'from') return;

        const [arg1, arg2] = node.arguments;
        if (!arg1) return;
        const type = getServices().getTypeAtLocation(arg1);
        const isArray = getChecker().isArrayType(type) || getChecker().isTupleType(type);
        if (!isArray) return;

        const arg1Txt = context.sourceCode.getText(arg1);
        const arrTxt = arg2 ? arg1Txt : `[...${arg1Txt}]`;

        const mapFnTxt = context.sourceCode.getText(arg2);
        const mapTxt = arg2 ? `.map(${mapFnTxt})` : '';
        context.report({
          node,
          messageId: 'noArrayFromArray',
          fix(fixer) {
            return fixer.replaceText(node, `${arrTxt}${mapTxt}`);
          },
        });
      },
    };
  },
});

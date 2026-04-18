import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_IGNORE_PROMISES = true;
const DEFAULT_IGNORED_FUNCTIONS: string[] = [];
const DEFAULT_IGNORED_OBJECTS: string[] = [];
const DEFAULT_IGNORED_METHODS: string[] = [];

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid discarding the result of expression statements',
      pedantic: true,
      requiresTypeChecking: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePromises: {
            description: `Whether to ignore floating promises. Default: \`${DEFAULT_IGNORE_PROMISES}\``,
            type: 'boolean',
          },
          ignoredFunctions: {
            description: `Names of functions to ignore. Default: \`${JSON.stringify(DEFAULT_IGNORED_FUNCTIONS)}\``,
            type: 'array',
            items: { type: 'string' },
          },
          ignoredObjects: {
            description: `Names of objects to ignore in method calls. Default: \`${JSON.stringify(DEFAULT_IGNORED_OBJECTS)}\``,
            type: 'array',
            items: { type: 'string' },
          },
          ignoredMethods: {
            description: `Names of methods to ignore. Default: \`${JSON.stringify(DEFAULT_IGNORED_METHODS)}\``,
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      unusedExpression: 'This expression is unused.',
    },
  },
  defaultOptions: [
    {
      ignorePromises: DEFAULT_IGNORE_PROMISES,
      ignoredFunctions: DEFAULT_IGNORED_FUNCTIONS,
      ignoredObjects: DEFAULT_IGNORED_OBJECTS,
      ignoredMethods: DEFAULT_IGNORED_METHODS,
    },
  ],
  create(context, [options]) {
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

    const windowMethods = ['open', 'requestAnimationFrame', 'setInterval', 'setTimeout'];

    const ALWAYS_ALLOWED_FUNCTIONS = [
      ...windowMethods,
      'describe',
      'onRefetch',
      'refetch',
      'render',
      'set',
      'setInterval',
      'setTimeout',
    ];

    const dateMethods = [
      'setDate',
      'setFullYear',
      'setHours',
      'setMilliseconds',
      'setMinutes',
      'setMonth',
      'setSeconds',
      'setTime',
      'setUTCDate',
      'setUTCFullYear',
      'setUTCHours',
      'setUTCMilliseconds',
      'setUTCMinutes',
      'setUTCMonth',
      'setUTCSeconds',
    ];

    const testingMethods = ['mock', 'mockClear', 'mockImplementation', 'spyOn', 'unmock'];

    const testingLibraryQueries = [
      'ByRole',
      'ByLabelText',
      'ByPlaceholderText',
      'ByText',
      'ByDisplayValue',
      'ByAltText',
      'ByTitle',
      'ByTestId',
    ];
    const testingLibraryMethodsPrefixes = [
      'get',
      'query',
      'getAll',
      'queryAll',
      'find',
      'findAll',
    ];

    const testingLibraryMethods: string[] = testingLibraryQueries.flatMap((query) =>
      testingLibraryMethodsPrefixes.map((prefix) => `${prefix}${query}`),
    );

    const ALWAYS_ALLOWED_METHODS = [
      'add',
      'assign',
      'defineProperty',
      'delete',
      'fill',
      'measure',
      'open',
      'pop',
      'push',
      'reduce',
      'set',
      'setQueryData',
      'unshift',

      ...dateMethods,
      ...windowMethods,
      ...testingMethods,
      ...testingLibraryMethods,
    ];

    const allowedFunctions = new Set([
      ...options.ignoredFunctions,
      ...ALWAYS_ALLOWED_FUNCTIONS,
    ]);
    const allowedObjects = new Set(options.ignoredObjects);
    const allowedMethods = new Set([
      ...options.ignoredMethods,
      ...ALWAYS_ALLOWED_METHODS,
    ]);

    return {
      // TODO: maybe limit to CallExpression and await expressions?
      ExpressionStatement(stmt) {
        const expr = stmt.expression;

        switch (expr.type) {
          case AST_NODE_TYPES.AssignmentExpression:
          case AST_NODE_TYPES.BinaryExpression:
          case AST_NODE_TYPES.ConditionalExpression:
          case AST_NODE_TYPES.LogicalExpression:
          case AST_NODE_TYPES.UpdateExpression:
          case AST_NODE_TYPES.YieldExpression:
            return;

          case AST_NODE_TYPES.UnaryExpression:
            if (expr.operator === 'delete' || expr.operator === 'void') return;
            break;

          case AST_NODE_TYPES.Literal:
            if (typeof expr.value === 'string' && expr.value.startsWith('use ')) {
              return;
            }
            break;

          case AST_NODE_TYPES.CallExpression: {
            if (
              shouldIgnoreCallExpression(
                expr,
                allowedFunctions,
                allowedObjects,
                allowedMethods,
              )
            ) {
              return;
            }
            break;
          }

          case AST_NODE_TYPES.ChainExpression:
            if (expr.expression.type !== AST_NODE_TYPES.CallExpression) break;
            if (
              shouldIgnoreCallExpression(
                expr.expression,
                allowedFunctions,
                allowedObjects,
                allowedMethods,
              )
            ) {
              return;
            }
            break;

          case AST_NODE_TYPES.AwaitExpression:
            if (expr.argument.type !== AST_NODE_TYPES.CallExpression) break;
            if (
              shouldIgnoreCallExpression(
                expr.argument,
                allowedFunctions,
                allowedObjects,
                allowedMethods,
              )
            ) {
              return;
            }
            break;

          default:
            break;
        }

        if (isVoidExpr(stmt.expression)) return;

        context.report({ node: stmt.expression, messageId: 'unusedExpression' });
      },
    };

    function isVoidExpr(expression: TSESTree.Expression): boolean {
      const type = getServices().getTypeAtLocation(expression);

      if (isVoidType(type)) return true;

      if (
        expression.type === AST_NODE_TYPES.CallExpression &&
        expression.callee.type === AST_NODE_TYPES.MemberExpression
      ) {
        const objectType = getServices().getTypeAtLocation(expression.callee.object);
        if (getChecker().isTypeAssignableTo(type, objectType)) {
          return true;
        }
      }

      return false;
    }

    function isVoidType(type: ts.Type): boolean {
      if (type.isUnionOrIntersection()) {
        if (options.ignorePromises && type.types.some((t) => isPromiseType(t))) {
          return true;
        }

        return type.types.every((t) => isVoidType(t));
      }

      if (getChecker().isArrayType(type) || getChecker().isTupleType(type)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const args = getChecker().getTypeArguments(type as ts.TypeReference);
        return args.every((t) => isVoidType(t));
      }

      if (options.ignorePromises && isPromiseType(type)) return true;

      const flags =
        ts.TypeFlags.Void |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Null |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.Any;
      return (type.getFlags() & flags) !== 0;
    }
  },
});

function isPromiseType(type: ts.Type): boolean {
  return type.getSymbol()?.getName() === 'Promise';
}

function shouldIgnoreCallExpression(
  expr: TSESTree.CallExpression,
  allowedFunctions: Set<string>,
  allowedObjects: Set<string>,
  allowedMethods: Set<string>,
): boolean {
  switch (expr.callee.type) {
    case AST_NODE_TYPES.Identifier: {
      return allowedFunctions.has(expr.callee.name);
    }

    case AST_NODE_TYPES.MemberExpression: {
      const obj = expr.callee.object;
      const isAllowedObject =
        obj.type === AST_NODE_TYPES.Identifier && allowedObjects.has(obj.name);
      const prop = expr.callee.property;
      const isAllowedMethod =
        prop.type === AST_NODE_TYPES.Identifier && allowedMethods.has(prop.name);
      return isAllowedObject || isAllowedMethod;
    }

    default:
      return false;
  }
}

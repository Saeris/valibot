import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues, getOutput, assign } from '../../utils/index.ts';

/**
 * Symbol schema type.
 */
export type SymbolSchema<TOutput = symbol> = BaseSchema<symbol, TOutput> & {
  kind: 'symbol';
};

/**
 * Creates a symbol schema.
 *
 * @param error The error message.
 *
 * @returns A symbol schema.
 */
export function symbol(error?: ErrorMessage): SymbolSchema {
  return assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (typeof input !== 'symbol') {
        return getSchemaIssues(
          info,
          'type',
          'symbol',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input);
    },
    {
      kind: 'symbol',
      async: false,
    } as const
  );
}

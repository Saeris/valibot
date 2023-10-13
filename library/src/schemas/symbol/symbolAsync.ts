import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Symbol schema async type.
 */
export type SymbolSchemaAsync<TOutput = symbol> = BaseSchemaAsync<
  symbol,
  TOutput
> & {
  kind: 'symbol';
};

/**
 * Creates an async symbol schema.
 *
 * @param error The error message.
 *
 * @returns An async symbol schema.
 */
export function symbolAsync(error?: ErrorMessage): SymbolSchemaAsync {
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
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
      async: true,
    } as const
  );
}

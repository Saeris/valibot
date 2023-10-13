import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export type NullSchemaAsync<TOutput = null> = BaseSchemaAsync<null, TOutput> & {
  kind: 'null';
};

/**
 * Creates an async null schema.
 *
 * @param error The error message.
 *
 * @returns An async null schema.
 */
export function nullTypeAsync(error?: ErrorMessage): NullSchemaAsync {
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (input !== null) {
        return getSchemaIssues(
          info,
          'type',
          'null',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input);
    },
    {
      kind: 'null',
      async: true,
    } as const
  );
}

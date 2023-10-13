import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues, getOutput, assign } from '../../utils/index.ts';

/**
 * Undefined schema async type.
 */
export type UndefinedSchemaAsync<TOutput = undefined> = BaseSchemaAsync<
  undefined,
  TOutput
> & {
  kind: 'undefined';
};

/**
 * Creates an async undefined schema.
 *
 * @param error The error message.
 *
 * @returns An async undefined schema.
 */
export function undefinedTypeAsync(error?: ErrorMessage): UndefinedSchemaAsync {
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(
          info,
          'type',
          'undefined',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input);
    },
    {
      kind: 'undefined',
      async: true,
    } as const
  );
}

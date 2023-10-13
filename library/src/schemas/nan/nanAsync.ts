import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * NaN schema async type.
 */
export type NanSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
  kind: 'nan';
};

/**
 * Creates an async NaN schema.
 *
 * @param error The error message.
 *
 * @returns An async NaN schema.
 */
export function nanAsync(error?: ErrorMessage): NanSchemaAsync {
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (!Number.isNaN(input)) {
        return getSchemaIssues(
          info,
          'type',
          'nan',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as number);
    },
    {
      kind: 'nan',
      async: true,
    } as const
  );
}

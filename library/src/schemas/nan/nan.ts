import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues, getOutput, assign } from '../../utils/index.ts';

/**
 * NaN schema type.
 */
export type NanSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  kind: 'nan';
};

/**
 * Creates a NaN schema.
 *
 * @param error The error message.
 *
 * @returns A NaN schema.
 */
export function nan(error?: ErrorMessage): NanSchema {
  return assign(
    (input: unknown, info?: ParseInfo) => {
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
      async: false,
    } as const
  );
}

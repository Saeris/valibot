import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues, getOutput, assign } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
  kind: 'null';
};

/**
 * Creates a null schema.
 *
 * @param error The error message.
 *
 * @returns A null schema.
 */
export function nullType(error?: ErrorMessage): NullSchema {
  return assign(
    (input: unknown, info?: ParseInfo) => {
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
      async: false,
    } as const
  );
}

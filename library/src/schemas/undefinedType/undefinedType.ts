import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Undefined schema type.
 */
export type UndefinedSchema<TOutput = undefined> = BaseSchema<
  undefined,
  TOutput
> & {
  kind: 'undefined';
};

/**
 * Creates a undefined schema.
 *
 * @param error The error message.
 *
 * @returns A undefined schema.
 */
export function undefinedType(error?: ErrorMessage): UndefinedSchema {
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
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
      async: false,
    } as const
  );
}

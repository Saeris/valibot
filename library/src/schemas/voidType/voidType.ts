import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
  kind: 'void';
};

/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
export function voidType(error?: ErrorMessage): VoidSchema {
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      if (typeof input !== 'undefined') {
        return getSchemaIssues(
          info,
          'type',
          'void',
          error || 'Invalid type',
          input
        );
      }

      return getOutput(input);
    },
    {
      kind: 'void',
      async: false,
    } as const
  );
}

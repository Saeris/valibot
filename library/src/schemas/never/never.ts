import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { assign, getSchemaIssues } from '../../utils/index.ts';

/**
 * Never schema type.
 */
export type NeverSchema = BaseSchema<never> & {
  kind: 'never';
};

/**
 * Creates a never schema.
 *
 * @param error The error message.
 *
 * @returns A never schema.
 */
export function never(error?: ErrorMessage): NeverSchema {
  return assign(
    (input: unknown, info?: ParseInfo) => {
      return getSchemaIssues(
        info,
        'type',
        'never',
        error || 'Invalid type',
        input
      );
    },
    {
      kind: 'never',
      async: false,
    } as const
  );
}

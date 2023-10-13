import type { ObjectSchema } from '../../schemas/object/index.ts';
import type { ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Creates a strict object schema that throws an error if an input contains
 * unknown keys.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
export function strict<TSchema extends ObjectSchema<any>>(
  schema: TSchema,
  error?: ErrorMessage
): TSchema {
  return Object.assign((input: unknown, info?: ParseInfo) => {
    const result = schema(input, info);
    return !result.issues &&
      Object.keys(input as object).some((key) => !(key in schema.object))
      ? getSchemaIssues(
          info,
          'object',
          'strict',
          error || 'Invalid keys',
          input
        )
      : result;
  }, schema);
}

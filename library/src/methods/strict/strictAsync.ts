import type { ObjectSchemaAsync } from '../../schemas/object/index.ts';
import type { ErrorMessage, ParseInfoAsync } from '../../types.ts';
import { assign, getSchemaIssues } from '../../utils/index.ts';

/**
 * Creates a strict async object schema that throws an error if an input
 * contains unknown keys.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
export function strictAsync<TSchema extends ObjectSchemaAsync<any>>(
  schema: TSchema,
  error?: ErrorMessage
): TSchema {
  return assign(async (input: unknown, info?: ParseInfoAsync) => {
    const result = await schema(input, info);
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

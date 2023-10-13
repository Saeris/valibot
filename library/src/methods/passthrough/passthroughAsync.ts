import type { ObjectSchemaAsync } from '../../schemas/object/index.ts';
import type { ParseInfoAsync } from '../../types.ts';
import { assign, getOutput } from '../../utils/index.ts';

/**
 * Creates an object schema that passes unknown keys.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function passthroughAsync<TSchema extends ObjectSchemaAsync<any>>(
  schema: TSchema
): TSchema {
  return assign(async (input: unknown, info?: ParseInfoAsync) => {
    const result = await schema(input, info);
    return !result.issues
      ? getOutput({ ...(input as object), ...result.output })
      : result;
  }, schema);
}

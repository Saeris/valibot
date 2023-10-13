import type { ObjectSchemaAsync } from '../../schemas/object/index.ts';
import type { ParseInfoAsync } from '../../types.ts';
import { assign, getOutput } from '../../utils/index.ts';

/**
 * Creates an object schema that strips unknown keys.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function stripAsync<TSchema extends ObjectSchemaAsync<any>>(
  schema: TSchema
): TSchema {
  // Create cached keys
  let cachedKeys: string[];

  // Create and return object schema
  return assign(async (input: unknown, info?: ParseInfoAsync) => {
    // Get parse result of schema
    const result = await schema(input, info);

    // Return result if there are issues
    if (result.issues) {
      return result;
    }

    // Cache object keys lazy
    cachedKeys = cachedKeys || Object.keys(schema.object);

    // Strip unknown keys
    const output: Record<string, any> = {};
    for (const key of cachedKeys) {
      output[key] = result.output[key];
    }

    // Return stripped output
    return getOutput(output);
  }, schema);
}

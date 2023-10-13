import type { ObjectSchema } from '../../schemas/object/index.ts';
import type { ParseInfo } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates an object schema that strips unknown keys.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function strip<TSchema extends ObjectSchema<any>>(
  schema: TSchema
): TSchema {
  // Create cached keys
  let cachedKeys: string[];

  // Create and return object schema
  return Object.assign((input: unknown, info?: ParseInfo) => {
    // Get parse result of schema
    const result = schema(input, info);

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

import type { ObjectSchema } from '../../schemas/object/index.ts';
import type { ParseInfo } from '../../types.ts';
import { assign, getOutput } from '../../utils/index.ts';

/**
 * Creates an object schema that passes unknown keys.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function passthrough<TSchema extends ObjectSchema<any>>(
  schema: TSchema
): TSchema {
  return assign((input: unknown, info?: ParseInfo) => {
    const result = schema(input, info);
    return !result.issues
      ? getOutput({ ...(input as object), ...result.output })
      : result;
  }, schema);
}

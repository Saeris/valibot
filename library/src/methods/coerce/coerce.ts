import type { BaseSchema, Input, ParseInfo } from '../../types.ts';
import { assign } from '../../utils/assign.ts';

/**
 * Coerces the input of a schema to match the required type.
 *
 * @param schema The affected schema.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
export function coerce<TSchema extends BaseSchema>(
  schema: TSchema,
  action: (value: unknown) => Input<TSchema>
): TSchema {
  return assign((input: unknown, info?: ParseInfo) => {
    return schema(action(input), info);
  }, schema);
}

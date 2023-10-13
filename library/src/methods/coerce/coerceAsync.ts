import type { BaseSchemaAsync, Input, ParseInfoAsync } from '../../types.ts';
import { assign } from '../../utils/assign.ts';

/**
 * Coerces the input of a async schema to match the required type.
 *
 * @param schema The affected schema.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
export function coerceAsync<TSchema extends BaseSchemaAsync>(
  schema: TSchema,
  action: (value: unknown) => Input<TSchema> | Promise<Input<TSchema>>
): TSchema {
  return assign(async (input: unknown, info?: ParseInfoAsync) => {
    return schema(await action(input), info);
  }, schema);
}

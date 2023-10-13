import type { BaseSchema, Output, ParseInfo } from '../../types.ts';
import { assign, getOutput } from '../../utils/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param value The fallback value.
 *
 * @returns The passed schema.
 */
export function fallback<TSchema extends BaseSchema>(
  schema: TSchema,
  value: Output<TSchema> | ((info: FallbackInfo) => Output<TSchema>)
): TSchema {
  return assign((input: unknown, info?: ParseInfo) => {
    const result = schema(input, info);
    return getOutput(
      result.issues
        ? typeof value === 'function'
          ? (value as (info: FallbackInfo) => Output<TSchema>)({
              input,
              issues: result.issues,
            })
          : value
        : result.output
    );
  }, schema);
}

import type {
  BaseSchema,
  BaseSchemaAsync,
  Output,
  ParseInfoAsync,
} from '../../types.ts';
import { getOutput } from '../../utils/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param value The fallback value.
 *
 * @returns The passed schema.
 */
export function fallbackAsync<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  value: Output<TSchema> | ((info: FallbackInfo) => Output<TSchema>)
): TSchema {
  return Object.assign(async (input: unknown, info?: ParseInfoAsync) => {
    const result = await schema(input, info);
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

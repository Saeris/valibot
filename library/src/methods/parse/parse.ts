import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Output, ParseInfo } from '../../types.ts';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
export function parse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown,
  info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>
): Output<TSchema> {
  const result = schema(input, info);
  if (result.issues) {
    throw new ValiError(result.issues);
  }
  return result.output;
}

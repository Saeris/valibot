import type {
  BaseSchemaAsync,
  ParseInfoAsync,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import { assign, executePipeAsync } from '../../utils/index.ts';

/**
 * Unknown schema async type.
 */
export type UnknownSchemaAsync<TOutput = unknown> = BaseSchemaAsync<
  unknown,
  TOutput
> & {
  kind: 'unknown';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
export function unknownAsync(
  pipe: PipeAsync<unknown> = []
): UnknownSchemaAsync {
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      return executePipeAsync(input, pipe, info, 'unknown');
    },
    {
      kind: 'unknown',
      async: true,
      checks: getChecks(pipe),
    } as const
  );
}

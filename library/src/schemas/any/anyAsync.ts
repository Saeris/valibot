import type {
  BaseSchemaAsync,
  ParseInfoAsync,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import { assign, executePipeAsync, getChecks } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
  kind: 'any';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async any schema.
 */
export function anyAsync(pipe: PipeAsync<any> = []): AnySchemaAsync {
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      return executePipeAsync(input, pipe, info, 'any');
    },
    {
      kind: 'any',
      async: true,
      checks: getChecks(pipe),
    } as const
  );
}

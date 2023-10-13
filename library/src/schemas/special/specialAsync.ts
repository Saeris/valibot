import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import {
  assign,
  executePipeAsync,
  getChecks,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Special schema async type.
 */
export type SpecialSchemaAsync<TInput, TOutput = TInput> = BaseSchemaAsync<
  TInput,
  TOutput
> & {
  kind: 'special';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  error?: ErrorMessage,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  arg2?: PipeAsync<TInput> | ErrorMessage,
  arg3?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return string schema
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (!(await check(input))) {
        return getSchemaIssues(
          info,
          'type',
          'special',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input as TInput, pipe, info, 'special');
    },
    {
      kind: 'special',
      async: true,
      checks: getChecks(pipe),
    } as const
  );
}

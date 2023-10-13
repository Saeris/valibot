import type {
  BaseSchema,
  ErrorMessage,
  ParseInfo,
  Pipe,
  PipeMeta,
} from '../../types.ts';
import {
  assign,
  executePipe,
  getChecks,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Special schema type.
 */
export type SpecialSchema<TInput, TOutput = TInput> = BaseSchema<
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
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  error?: ErrorMessage,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

export function special<TInput>(
  check: (input: unknown) => boolean,
  arg2?: Pipe<TInput> | ErrorMessage,
  arg3?: Pipe<TInput>
): SpecialSchema<TInput> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return string schema
  return assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (!check(input)) {
        return getSchemaIssues(
          info,
          'type',
          'special',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input as TInput, pipe, info, 'special');
    },
    {
      kind: 'special',
      async: false,
      checks: getChecks(pipe),
    } as const
  );
}

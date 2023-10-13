import type {
  BaseSchema,
  ErrorMessage,
  ParseInfo,
  Pipe,
  PipeMeta,
} from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Bigint schema type.
 */
export type BigintSchema<TOutput = bigint> = BaseSchema<bigint, TOutput> & {
  kind: 'bigint';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates a bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(pipe?: Pipe<bigint>): BigintSchema;

/**
 * Creates a bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(error?: ErrorMessage, pipe?: Pipe<bigint>): BigintSchema;

export function bigint(
  arg1?: ErrorMessage | Pipe<bigint>,
  arg2?: Pipe<bigint>
): BigintSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return bigint schema
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (typeof input !== 'bigint') {
        return getSchemaIssues(
          info,
          'type',
          'bigint',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'bigint');
    },
    {
      kind: 'bigint',
      async: false,
      checks: getChecks(pipe),
    } as const
  );
}

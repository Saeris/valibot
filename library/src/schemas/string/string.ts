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
 * String schema type.
 */
export type StringSchema<TOutput = string> = BaseSchema<string, TOutput> & {
  kind: 'string';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates a string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(pipe?: Pipe<string>): StringSchema;

/**
 * Creates a string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(error?: ErrorMessage, pipe?: Pipe<string>): StringSchema;

export function string(
  arg1?: ErrorMessage | Pipe<string>,
  arg2?: Pipe<string>
): StringSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return string schema
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (typeof input !== 'string') {
        return getSchemaIssues(
          info,
          'type',
          'string',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'string');
    },
    {
      kind: 'string',
      async: false,
      checks: getChecks(pipe),
    } as const
  );
}

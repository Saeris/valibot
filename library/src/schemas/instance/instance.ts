import type {
  BaseSchema,
  ErrorMessage,
  ParseInfoAsync,
  Pipe,
  PipeMeta,
} from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import {
  assign,
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Class enum type.
 */
export type Class = abstract new (...args: any) => any;

/**
 * Instance schema type.
 */
export type InstanceSchema<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> = BaseSchema<InstanceType<TClass>, TOutput> & {
  kind: 'instance';
  /**
   * The class of the instance.
   */
  class: TClass;
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an instance schema.
 *
 * @param of The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  of: TClass,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

/**
 * Creates an instance schema.
 *
 * @param of The class of the instance.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  of: TClass,
  error?: ErrorMessage,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

export function instance<TClass extends Class>(
  of: TClass,
  arg2?: Pipe<InstanceType<TClass>> | ErrorMessage,
  arg3?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return string schema
  return assign(
    (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (!(input instanceof of)) {
        return getSchemaIssues(
          info,
          'type',
          'instance',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'instance');
    },
    {
      kind: 'instance',
      async: false,
      class: of,
      checks: getChecks(pipe),
    } as const
  );
}

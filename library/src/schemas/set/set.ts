import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  ParseInfo,
  Pipe,
  PipeMeta,
} from '../../types.ts';
import {
  executePipe,
  getChecks,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema type.
 */
export type SetSchema<
  TSetValue extends BaseSchema,
  TOutput = SetOutput<TSetValue>
> = BaseSchema<SetInput<TSetValue>, TOutput> & {
  kind: 'set';
  /**
   * The set value schema.
   */
  set: { value: TSetValue };
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TSetValue extends BaseSchema>(
  value: TSetValue,
  pipe?: Pipe<SetOutput<TSetValue>>
): SetSchema<TSetValue>;

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TSetValue extends BaseSchema>(
  value: TSetValue,
  error?: ErrorMessage,
  pipe?: Pipe<SetOutput<TSetValue>>
): SetSchema<TSetValue>;

export function set<TSetValue extends BaseSchema>(
  value: TSetValue,
  arg2?: Pipe<SetOutput<TSetValue>> | ErrorMessage,
  arg3?: Pipe<SetOutput<TSetValue>>
): SetSchema<TSetValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return set schema
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (!(input instanceof Set)) {
        return getSchemaIssues(
          info,
          'type',
          'set',
          error || 'Invalid type',
          input
        );
      }

      // Create key, output and issues
      let key = 0;
      let issues: Issues | undefined;
      const output: SetOutput<TSetValue> = new Set();

      // Parse each value by schema
      for (const inputValue of input) {
        // Get parse result of input value
        const result = value(inputValue, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create set path item
          const pathItem: SetPathItem = {
            schema: 'set',
            input,
            key,
            value: inputValue,
          };

          // Add modified result issues to issues
          for (const issue of result.issues) {
            if (issue.path) {
              issue.path.unshift(pathItem);
            } else {
              issue.path = [pathItem];
            }
            issues?.push(issue);
          }
          if (!issues) {
            issues = result.issues;
          }

          // If necessary, abort early
          if (info?.abortEarly) {
            break;
          }

          // Otherwise, add item to set
        } else {
          output.add(result.output);
        }

        // Increment key
        key++;
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(output, pipe, info, 'set');
    },
    {
      kind: 'set',
      async: false,
      set: { value },
      checks: getChecks(pipe),
    } as const
  );
}

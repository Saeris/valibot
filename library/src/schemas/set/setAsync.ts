import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  ParseInfoAsync,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import {
  assign,
  executePipeAsync,
  getChecks,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema async type.
 */
export type SetSchemaAsync<
  TSetValue extends BaseSchema | BaseSchemaAsync,
  TOutput = SetOutput<TSetValue>
> = BaseSchemaAsync<SetInput<TSetValue>, TOutput> & {
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
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TSetValue extends BaseSchema | BaseSchemaAsync>(
  value: TSetValue,
  pipe?: PipeAsync<SetOutput<TSetValue>>
): SetSchemaAsync<TSetValue>;

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TSetValue extends BaseSchema | BaseSchemaAsync>(
  value: TSetValue,
  error?: ErrorMessage,
  pipe?: PipeAsync<SetOutput<TSetValue>>
): SetSchemaAsync<TSetValue>;

export function setAsync<TSetValue extends BaseSchema | BaseSchemaAsync>(
  value: TSetValue,
  arg2?: PipeAsync<SetOutput<TSetValue>> | ErrorMessage,
  arg3?: PipeAsync<SetOutput<TSetValue>>
): SetSchemaAsync<TSetValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return async set schema
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
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

      // Create index, output and issues
      let issues: Issues | undefined;
      const output: SetOutput<TSetValue> = new Set();

      // Parse each value by schema
      await Promise.all(
        Array.from(input.values()).map(async (inputValue, key) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            // Get parse result of input value
            const result = await value(inputValue, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
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
                  throw null;
                }

                // Otherwise, add item to set
              } else {
                output.add(result.output);
              }
            }
          }
        })
      ).catch(() => null);

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(input, pipe, info, 'set');
    },
    {
      kind: 'set',
      async: true,
      set: { value },
      checks: getChecks(pipe),
    } as const
  );
}

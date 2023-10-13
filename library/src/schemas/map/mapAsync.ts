import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  Output,
  ParseInfoAsync,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import {
  executePipeAsync,
  getChecks,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema async type.
 */
export type MapSchemaAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync,
  TOutput = MapOutput<TMapKey, TMapValue>
> = BaseSchemaAsync<MapInput<TMapKey, TMapValue>, TOutput> & {
  kind: 'map';
  /**
   * The map key and value schema.
   */
  map: { key: TMapKey; value: TMapValue };
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  pipe?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue>;

/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  error?: ErrorMessage,
  pipe?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue>;

export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  arg3?: PipeAsync<MapOutput<TMapKey, TMapValue>> | ErrorMessage,
  arg4?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return async map schema
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (!(input instanceof Map)) {
        return getSchemaIssues(
          info,
          'type',
          'map',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      const output: Map<Output<TMapKey>, Output<TMapValue>> = new Map();
      let issues: Issues | undefined;

      // Parse each key and value by schema
      await Promise.all(
        Array.from(input.entries()).map(async ([inputKey, inputValue]) => {
          // Create path item variable
          let pathItem: MapPathItem | undefined;

          // Get parse result of key and value
          const [keyResult, valueResult] = await Promise.all(
            (
              [
                { schema: key, value: inputKey, origin: 'key' },
                { schema: value, value: inputValue, origin: 'value' },
              ] as const
            ).map(async ({ schema, value, origin }) => {
              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                // Get parse result of value
                const result = await schema(value, {
                  origin,
                  abortEarly: info?.abortEarly,
                  abortPipeEarly: info?.abortPipeEarly,
                  skipPipe: info?.skipPipe,
                });

                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    // Create map path item
                    pathItem = pathItem || {
                      schema: 'map',
                      input,
                      key: inputKey,
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

                    // Otherwise, return parse result
                  } else {
                    return result;
                  }
                }
              }
            })
          ).catch(() => []);

          // Set entry if there are no issues
          if (keyResult && valueResult) {
            output.set(keyResult.output, valueResult.output);
          }
        })
      );

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(input, pipe, info, 'map');
    },
    {
      kind: 'map',
      async: true,
      map: { key, value },
      checks: getChecks(pipe),
    } as const
  );
}

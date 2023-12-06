import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Issues,
  type Output,
  type PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema async type.
 */
export class MapSchemaAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = MapOutput<TKey, TValue>
> extends BaseSchemaAsync<MapInput<TKey, TValue>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'map';
  /**
   * The map key schema.
   */
  key: TKey;
  /**
   * The map value schema.
   */
  value: TValue;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  constructor(
    key: TKey,
    value: TValue,
    arg3?: PipeAsync<TOutput> | ErrorMessage,
    arg4?: PipeAsync<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg3, arg4);
    this.key = key;
    this.value = value;
    this.message = message;
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(input instanceof Map)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create typed, issues and output
    let typed = true;
    let issues: Issues | undefined;
    const output: Map<Output<TKey>, Output<TValue>> = new Map();

    // Parse each key and value by schema
    await Promise.all(
      Array.from(input.entries()).map(async ([inputKey, inputValue]) => {
        // Create path item variable
        let pathItem: MapPathItem | undefined;

        // Get parse result of key and value
        const [keyResult, valueResult] = await Promise.all(
          (
            [
              { schema: this.key, value: inputKey, origin: 'key' },
              { schema: this.value, value: inputValue, origin: 'value' },
            ] as const
          ).map(async ({ schema, value, origin }) => {
            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // Get parse result of value
              const result = await schema._parse(value, {
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
                    type: 'map',
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
                }

                // Return parse result
                return result;
              }
            }
          })
        ).catch(() => []);

        // If not typed, set typed to false
        if (!keyResult?.typed || !valueResult?.typed) {
          typed = false;
        }

        // Set output of entry
        if (keyResult && valueResult) {
          output.set(keyResult.output, valueResult.output);
        }
      })
    );

    // If output is typed, execute pipe
    if (typed) {
      return pipeResultAsync(
        output as TOutput,
        this.pipe,
        info,
        this.type,
        issues
      );
    }

    // Otherwise, return untyped parse result
    return parseResult(false, output, issues as Issues);
  }
}

export interface MapSchemaAsyncFactory {
  /**
   * Creates an async map schema.
   *
   * @param key The key schema.
   * @param value The value schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async map schema.
   */
  <
    TKey extends BaseSchema | BaseSchemaAsync,
    TValue extends BaseSchema | BaseSchemaAsync
  >(
    key: TKey,
    value: TValue,
    pipe?: PipeAsync<MapOutput<TKey, TValue>>
  ): MapSchemaAsync<TKey, TValue>;

  /**
   * Creates an async map schema.
   *
   * @param key The key schema.
   * @param value The value schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async map schema.
   */
  <
    TKey extends BaseSchema | BaseSchemaAsync,
    TValue extends BaseSchema | BaseSchemaAsync
  >(
    key: TKey,
    value: TValue,
    message?: ErrorMessage,
    pipe?: PipeAsync<MapOutput<TKey, TValue>>
  ): MapSchemaAsync<TKey, TValue>;
}

export const mapAsync: MapSchemaAsyncFactory = <
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = MapOutput<TKey, TValue>
>(
  key: TKey,
  value: TValue,
  arg3?: PipeAsync<TOutput> | ErrorMessage,
  arg4?: PipeAsync<TOutput>
) => new MapSchemaAsync(key, value, arg3, arg4);

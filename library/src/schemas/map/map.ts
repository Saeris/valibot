import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Issues,
  type Output,
  type Pipe,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
} from '../../utils/index.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema type.
 */
export class MapSchema<
  const TKey extends BaseSchema,
  const TValue extends BaseSchema,
  const TOutput = MapOutput<TKey, TValue>
> extends BaseSchema<MapInput<TKey, TValue>, TOutput> {
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
  pipe?: Pipe<TOutput>;

  constructor(
    key: TKey,
    value: TValue,
    arg3?: Pipe<TOutput> | ErrorMessage,
    arg4?: Pipe<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg3, arg4);
    this.key = key;
    this.value = value;
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(input instanceof Map)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create typed, issues and output
    let typed = true;
    let issues: Issues | undefined;
    const output: Map<Output<TKey>, Output<TValue>> = new Map();

    // Parse each key and value by schema
    for (const [inputKey, inputValue] of input.entries()) {
      // Create path item variable
      let pathItem: MapPathItem | undefined;

      // Get parse result of key
      const keyResult = this.key._parse(inputKey, {
        origin: 'key',
        abortEarly: info?.abortEarly,
        abortPipeEarly: info?.abortPipeEarly,
        skipPipe: info?.skipPipe,
      });

      // If there are issues, capture them
      if (keyResult.issues) {
        // Create map path item
        pathItem = {
          type: 'map',
          input,
          key: inputKey,
          value: inputValue,
        };

        // Add modified result issues to issues
        for (const issue of keyResult.issues) {
          if (issue.path) {
            issue.path.unshift(pathItem);
          } else {
            issue.path = [pathItem];
          }
          issues?.push(issue);
        }
        if (!issues) {
          issues = keyResult.issues;
        }

        // If necessary, abort early
        if (info?.abortEarly) {
          typed = false;
          break;
        }
      }

      // Get parse result of value
      const valueResult = this.value._parse(inputValue, info);

      // If there are issues, capture them
      if (valueResult.issues) {
        // Create map path item
        pathItem = pathItem || {
          type: 'map',
          input,
          key: inputKey,
          value: inputValue,
        };

        // Add modified result issues to issues
        for (const issue of valueResult.issues) {
          if (issue.path) {
            issue.path.unshift(pathItem);
          } else {
            issue.path = [pathItem];
          }
          issues?.push(issue);
        }
        if (!issues) {
          issues = valueResult.issues;
        }

        // If necessary, abort early
        if (info?.abortEarly) {
          typed = false;
          break;
        }
      }

      // If not typed, set typed to false
      if (!keyResult.typed || !valueResult.typed) {
        typed = false;
      }

      // Set output of entry
      output.set(keyResult.output, valueResult.output);
    }

    // If output is typed, execute pipe
    if (typed) {
      return pipeResult(output as TOutput, this.pipe, info, this.type, issues);
    }

    // Otherwise, return untyped parse result
    return parseResult(false, output, issues as Issues);
  }
}

export interface MapSchemaFactory {
  /**
   * Creates a map schema.
   *
   * @param key The key schema.
   * @param value The value schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A map schema.
   */
  <const TKey extends BaseSchema, const TValue extends BaseSchema>(
    key: TKey,
    value: TValue,
    pipe?: Pipe<MapOutput<TKey, TValue>>
  ): MapSchema<TKey, TValue>;

  /**
   * Creates a map schema.
   *
   * @param key The key schema.
   * @param value The value schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A map schema.
   */
  <const TKey extends BaseSchema, const TValue extends BaseSchema>(
    key: TKey,
    value: TValue,
    message?: ErrorMessage,
    pipe?: Pipe<MapOutput<TKey, TValue>>
  ): MapSchema<TKey, TValue>;
}

export const map: MapSchemaFactory = <
  const TKey extends BaseSchema,
  const TValue extends BaseSchema,
  const TOutput = MapOutput<TKey, TValue>
>(
  key: TKey,
  value: TValue,
  arg3?: Pipe<TOutput> | ErrorMessage,
  arg4?: Pipe<TOutput>
) => new MapSchema(key, value, arg3, arg4);

import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  Output,
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
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema type.
 */
export type MapSchema<
  TMapKey extends BaseSchema,
  TMapValue extends BaseSchema,
  TOutput = MapOutput<TMapKey, TMapValue>
> = BaseSchema<MapInput<TMapKey, TMapValue>, TOutput> & {
  kind: 'map';
  /**
   * The map key and value schema.
   */
  map: { key: TMapKey; value: TMapValue };
  /**
   * Validation checks that will be applied to
   * the Map object.
   */
  checks: PipeMeta[];
};

/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
export function map<TMapKey extends BaseSchema, TMapValue extends BaseSchema>(
  key: TMapKey,
  value: TMapValue,
  pipe?: Pipe<MapOutput<TMapKey, TMapValue>>
): MapSchema<TMapKey, TMapValue>;

/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
export function map<TMapKey extends BaseSchema, TMapValue extends BaseSchema>(
  key: TMapKey,
  value: TMapValue,
  error?: ErrorMessage,
  pipe?: Pipe<MapOutput<TMapKey, TMapValue>>
): MapSchema<TMapKey, TMapValue>;

export function map<TMapKey extends BaseSchema, TMapValue extends BaseSchema>(
  key: TMapKey,
  value: TMapValue,
  arg3?: Pipe<MapOutput<TMapKey, TMapValue>> | ErrorMessage,
  arg4?: Pipe<MapOutput<TMapKey, TMapValue>>
): MapSchema<TMapKey, TMapValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return map schema
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
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
      let issues: Issues | undefined;
      const output: Map<Output<TMapKey>, Output<TMapValue>> = new Map();

      // Parse each key and value by schema
      for (const [inputKey, inputValue] of input.entries()) {
        // Create path item variable
        let pathItem: MapPathItem | undefined;

        // Get parse result of key
        const keyResult = key(inputKey, {
          origin: 'key',
          abortEarly: info?.abortEarly,
          abortPipeEarly: info?.abortPipeEarly,
          skipPipe: info?.skipPipe,
        });

        // If there are issues, capture them
        if (keyResult.issues) {
          // Create map path item
          pathItem = {
            schema: 'map',
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
            break;
          }
        }

        // Get parse result of value
        const valueResult = value(inputValue, info);

        // If there are issues, capture them
        if (valueResult.issues) {
          // Create map path item
          pathItem = pathItem || {
            schema: 'map',
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
            break;
          }
        }

        // Set entry if there are no issues
        if (!keyResult.issues && !valueResult.issues) {
          output.set(keyResult.output, valueResult.output);
        }
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(output, pipe, info, 'map');
    },
    {
      kind: 'map',
      async: false,
      map: { key, value },
      checks: getChecks(pipe),
    } as const
  );
}

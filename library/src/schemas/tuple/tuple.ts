import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  ParseInfo,
  Pipe,
  PipeMeta,
} from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import {
  assign,
  executePipe,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { TupleOutput, TupleInput, TuplePathItem } from './types.ts';
import { getTupleArgs } from './utils/index.ts';

/**
 * Tuple shape type.
 */
export type TupleShape = [BaseSchema, ...BaseSchema[]];

/**
 * Tuple schema type.
 */
export type TupleSchema<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined,
  TOutput = TupleOutput<TTupleItems, TTupleRest>
> = BaseSchema<TupleInput<TTupleItems, TTupleRest>, TOutput> & {
  kind: 'tuple';
  /**
   * The tuple items and rest schema.
   */
  tuple: { items: TTupleItems; rest: TTupleRest };
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TTupleItems extends TupleShape>(
  items: TTupleItems,
  pipe?: Pipe<TupleOutput<TTupleItems, undefined>>
): TupleSchema<TTupleItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TTupleItems extends TupleShape>(
  items: TTupleItems,
  error?: ErrorMessage,
  pipe?: Pipe<TupleOutput<TTupleItems, undefined>>
): TupleSchema<TTupleItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema
>(
  items: TTupleItems,
  rest: TTupleRest,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema
>(
  items: TTupleItems,
  rest: TTupleRest,
  error?: ErrorMessage,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema
>(
  items: TTupleItems,
  arg2?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | ErrorMessage | TTupleRest,
  arg3?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | ErrorMessage,
  arg4?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getTupleArgs<
    TTupleRest,
    Pipe<TupleOutput<TTupleItems, TTupleRest>>
  >(arg2, arg3, arg4);

  // Create and return tuple schema
  return assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (
        // Not an array
        !Array.isArray(input) ||
        // No rest type and unequal lengths
        (!rest && items.length !== input.length) ||
        // Rest type provided and too few items
        (!!rest && items.length > input.length)
      ) {
        return getSchemaIssues(
          info,
          'type',
          'tuple',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each tuple item
      for (let key = 0; key < items.length; key++) {
        const value = input[key];
        const result = items[key](value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create tuple path item
          const pathItem: TuplePathItem = {
            schema: 'tuple',
            input: input as [any, ...any[]],
            key,
            value,
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

          // Otherwise, add item to tuple
        } else {
          output[key] = result.output;
        }
      }

      // If necessary parse schema of each rest item
      if (rest) {
        for (let key = items.length; key < input.length; key++) {
          const value = input[key];
          const result = rest(value, info);

          // If there are issues, capture them
          if (result.issues) {
            // Create tuple path item
            const pathItem: TuplePathItem = {
              schema: 'tuple',
              input: input as [any, ...any[]],
              key,
              value,
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

            // Otherwise, add item to tuple
          } else {
            output[key] = result.output;
          }
        }
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(
            output as TupleOutput<TTupleItems, TTupleRest>,
            pipe,
            info,
            'tuple'
          );
    },
    {
      kind: 'tuple',
      async: false,
      tuple: { items, rest },
      checks: getChecks(pipe),
    } as const
  );
}

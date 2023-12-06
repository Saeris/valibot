import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Issues,
  type PipeAsync,
} from '../../types/index.ts';
import {
  parseResult,
  pipeResultAsync,
  restAndDefaultArgs,
  schemaIssue,
} from '../../utils/index.ts';
import type { TupleInput, TupleOutput, TuplePathItem } from './types.ts';

/**
 * Tuple shape async type.
 */
export type TupleItemsAsync = [
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema | BaseSchemaAsync)[]
];

/**
 * Tuple schema async type.
 */
export class TupleSchemaAsync<
  const TItems extends TupleItemsAsync,
  const TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  const TOutput = TupleOutput<TItems, TRest>
> extends BaseSchemaAsync<TupleInput<TItems, TRest>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'tuple';
  /**
   * The tuple items schema.
   */
  items: TItems;
  /**
   * The tuple rest schema.
   */
  rest: TRest;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  constructor(
    items: TItems,
    arg2?: PipeAsync<TOutput> | ErrorMessage | TRest,
    arg3?: PipeAsync<TOutput> | ErrorMessage,
    arg4?: PipeAsync<TOutput>
  ) {
    super();
    // Get rest, message and pipe argument
    const [rest, message = 'Invalid type', pipe] = restAndDefaultArgs<
      TRest,
      PipeAsync<TOutput>
    >(arg2, arg3, arg4);
    this.items = items;
    this.rest = rest;
    this.message = message;
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!Array.isArray(input) || this.items.length > input.length) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create typed, issues and output
    let typed = true;
    let issues: Issues | undefined;
    const output: any[] = [];

    await Promise.all([
      // Parse schema of each tuple item
      Promise.all(
        this.items.map(async (schema, key) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            const value = input[key];
            const result = await schema._parse(value, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                // Create tuple path item
                const pathItem: TuplePathItem = {
                  type: 'tuple',
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
                  typed = false;
                  throw null;
                }
              }

              // If not typed, set typed to false
              if (!result.typed) {
                typed = false;
              }

              // Set output of item
              output[key] = result.output;
            }
          }
        })
      ),

      // If necessary parse schema of each rest item
      this.rest &&
        Promise.all(
          input.slice(this.items.length).map(async (value, index) => {
            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              const key = this.items.length + index;
              const result = await this.rest!._parse(value, info);

              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                // If there are issues, capture them
                if (result.issues) {
                  // Create tuple path item
                  const pathItem: TuplePathItem = {
                    type: 'tuple',
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
                    typed = false;
                    throw null;
                  }
                }

                // If not typed, set typed to false
                if (!result.typed) {
                  typed = false;
                }

                // Set output of item
                output[key] = result.output;
              }
            }
          })
        ),
    ]).catch(() => null);

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

export interface TupleSchemaAsyncFactory {
  /**
   * Creates an async tuple schema.
   *
   * @param items The items schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async tuple schema.
   */
  <const TItems extends TupleItemsAsync>(
    items: TItems,
    pipe?: PipeAsync<TupleOutput<TItems, undefined>>
  ): TupleSchemaAsync<TItems>;

  /**
   * Creates an async tuple schema.
   *
   * @param items The items schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async tuple schema.
   */
  <const TItems extends TupleItemsAsync>(
    items: TItems,
    message?: ErrorMessage,
    pipe?: PipeAsync<TupleOutput<TItems, undefined>>
  ): TupleSchemaAsync<TItems>;

  /**
   * Creates an async tuple schema.
   *
   * @param items The items schema.
   * @param rest The rest schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async tuple schema.
   */
  <
    const TItems extends TupleItemsAsync,
    const TRest extends BaseSchema | BaseSchemaAsync | undefined
  >(
    items: TItems,
    rest: TRest,
    pipe?: PipeAsync<TupleOutput<TItems, TRest>>
  ): TupleSchemaAsync<TItems, TRest>;

  /**
   * Creates an async tuple schema.
   *
   * @param items The items schema.
   * @param rest The rest schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async tuple schema.
   */
  <
    const TItems extends TupleItemsAsync,
    const TRest extends BaseSchema | BaseSchemaAsync | undefined
  >(
    items: TItems,
    rest: TRest,
    message?: ErrorMessage,
    pipe?: PipeAsync<TupleOutput<TItems, TRest>>
  ): TupleSchemaAsync<TItems, TRest>;
}

export const tupleAsync: TupleSchemaAsyncFactory = <
  const TItems extends TupleItemsAsync,
  const TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  const TOutput = TupleOutput<TItems, TRest>
>(
  items: TItems,
  arg2?: PipeAsync<TOutput> | ErrorMessage | TRest,
  arg3?: PipeAsync<TOutput> | ErrorMessage,
  arg4?: PipeAsync<TOutput>
) => new TupleSchemaAsync(items, arg2, arg3, arg4);

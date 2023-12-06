import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Issues,
  type Pipe,
} from '../../types/index.ts';
import {
  parseResult,
  pipeResult,
  restAndDefaultArgs,
  schemaIssue,
} from '../../utils/index.ts';
import type { TupleOutput, TupleInput, TuplePathItem } from './types.ts';

/**
 * Tuple shape type.
 */
export type TupleItems = [BaseSchema, ...BaseSchema[]];

/**
 * Tuple schema type.
 */
export class TupleSchema<
  const TItems extends TupleItems,
  const TRest extends BaseSchema | undefined = undefined,
  const TOutput = TupleOutput<TItems, TRest>
> extends BaseSchema<TupleInput<TItems, TRest>, TOutput> {
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
  pipe?: Pipe<TOutput>;

  constructor(
    items: TItems,
    arg2?: Pipe<TOutput> | ErrorMessage | TRest,
    arg3?: Pipe<TOutput> | ErrorMessage,
    arg4?: Pipe<TOutput>
  ) {
    super();
    // Get rest, message and pipe argument
    const [rest, message = 'Invalid type', pipe] = restAndDefaultArgs<
      TRest,
      Pipe<TOutput>
    >(arg2, arg3, arg4);
    this.items = items;
    this.rest = rest;
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!Array.isArray(input) || this.items.length > input.length) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create typed, issues and output
    let typed = true;
    let issues: Issues | undefined;
    const output: any[] = [];

    // Parse schema of each tuple item
    for (let key = 0; key < this.items.length; key++) {
      const value = input[key];
      const result = this.items[key]._parse(value, info);

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
          break;
        }
      }

      // If not typed, set typed to false
      if (!result.typed) {
        typed = false;
      }

      // Set output of item
      output[key] = result.output;
    }

    // If necessary parse schema of each rest item
    if (this.rest && !(info?.abortEarly && issues)) {
      for (let key = this.items.length; key < input.length; key++) {
        const value = input[key];
        const result = this.rest._parse(value, info);

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
            break;
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

    // If output is typed, execute pipe
    if (typed) {
      return pipeResult(output as TOutput, this.pipe, info, this.type, issues);
    }

    // Otherwise, return untyped parse result
    return parseResult(false, output, issues as Issues);
  }
}

export interface TupleSchemaFactory {
  /**
   * Creates a tuple schema.
   *
   * @param items The items schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A tuple schema.
   */
  <const TItems extends TupleItems>(
    items: TItems,
    pipe?: Pipe<TupleOutput<TItems, undefined>>
  ): TupleSchema<TItems>;

  /**
   * Creates a tuple schema.
   *
   * @param items The items schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A tuple schema.
   */
  <const TItems extends TupleItems>(
    items: TItems,
    message?: ErrorMessage,
    pipe?: Pipe<TupleOutput<TItems, undefined>>
  ): TupleSchema<TItems>;

  /**
   * Creates a tuple schema.
   *
   * @param items The items schema.
   * @param rest The rest schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A tuple schema.
   */
  <const TItems extends TupleItems, const TRest extends BaseSchema | undefined>(
    items: TItems,
    rest: TRest,
    pipe?: Pipe<TupleOutput<TItems, TRest>>
  ): TupleSchema<TItems, TRest>;

  /**
   * Creates a tuple schema.
   *
   * @param items The items schema.
   * @param rest The rest schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A tuple schema.
   */
  <const TItems extends TupleItems, const TRest extends BaseSchema | undefined>(
    items: TItems,
    rest: TRest,
    message?: ErrorMessage,
    pipe?: Pipe<TupleOutput<TItems, TRest>>
  ): TupleSchema<TItems, TRest>;
}

export const tuple: TupleSchemaFactory = <
  const TItems extends TupleItems,
  const TRest extends BaseSchema | undefined = undefined,
  const TOutput = TupleOutput<TItems, TRest>
>(
  items: TItems,
  arg2?: Pipe<TOutput> | ErrorMessage | TRest,
  arg3?: Pipe<TOutput> | ErrorMessage,
  arg4?: Pipe<TOutput>
) => new TupleSchema(items, arg2, arg3, arg4);

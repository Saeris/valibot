import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Input,
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
import type { ArrayPathItem } from './types.ts';

/**
 * Array schema type.
 */
export class ArraySchema<
  const TItem extends BaseSchema,
  const TOutput = Output<TItem>[]
> extends BaseSchema<Input<TItem>[], TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'array';
  /**
   * The array item schema.
   */
  item: TItem;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: Pipe<TOutput>;

  constructor(
    item: TItem,
    arg2?: ErrorMessage | Pipe<TOutput>,
    arg3?: Pipe<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);
    this.item = item;
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!Array.isArray(input)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create typed, issues and output
    let typed = true;
    let issues: Issues | undefined;
    const output: any[] = [];

    // Parse schema of each array item
    for (let key = 0; key < input.length; key++) {
      const value = input[key];
      const result = this.item._parse(value, info);

      // If there are issues, capture them
      if (result.issues) {
        // Create array path item
        const pathItem: ArrayPathItem = {
          type: 'array',
          input,
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
      output.push(result.output);
    }

    // If output is typed, execute pipe
    if (typed) {
      return pipeResult<TOutput>(
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

export interface ArraySchemaFactory {
  /**
   * Creates a array schema.
   *
   * @param item The item schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A array schema.
   */
  <TItem extends BaseSchema>(
    item: TItem,
    pipe?: Pipe<Output<TItem>[]>
  ): ArraySchema<TItem>;
  /**
   * Creates a array schema.
   *
   * @param item The item schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A array schema.
   */
  <TItem extends BaseSchema>(
    item: TItem,
    message?: ErrorMessage,
    pipe?: Pipe<Output<TItem>[]>
  ): ArraySchema<TItem>;
}

export const array: ArraySchemaFactory = <
  const TItem extends BaseSchema,
  const TOutput = Output<TItem>[]
>(
  item: TItem,
  arg2?: Pipe<TOutput> | ErrorMessage,
  arg3?: Pipe<TOutput>
) => new ArraySchema(item, arg2, arg3);

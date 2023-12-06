import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Issues,
  type Pipe,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema type.
 */
export class SetSchema<
  const TValue extends BaseSchema,
  const TOutput = SetOutput<TValue>
> extends BaseSchema<SetInput<TValue>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'set';
  /**
   * The set value schema.
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
    value: TValue,
    arg2?: Pipe<TOutput> | ErrorMessage,
    arg3?: Pipe<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);
    this.value = value;
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(input instanceof Set)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create key, typed, output and issues
    let key = 0;
    let typed = true;
    let issues: Issues | undefined;
    const output: SetOutput<TValue> = new Set();

    // Parse each value by schema
    for (const inputValue of input) {
      // Get parse result of input value
      const result = this.value._parse(inputValue, info);

      // If there are issues, capture them
      if (result.issues) {
        // Create set path item
        const pathItem: SetPathItem = {
          type: 'set',
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
          typed = false;
          break;
        }
      }

      // If not typed, set typed to false
      if (!result.typed) {
        typed = false;
      }

      // Set output of entry if necessary
      output.add(result.output);

      // Increment key
      key++;
    }

    // If output is typed, execute pipe
    if (typed) {
      return pipeResult(output as TOutput, this.pipe, info, this.type, issues);
    }

    // Otherwise, return untyped parse result
    return parseResult(false, output, issues as Issues);
  }
}

export interface SetSchemaFactory {
  /**
   * Creates a set schema.
   *
   * @param value The value schema.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A set schema.
   */
  <const TValue extends BaseSchema>(
    value: TValue,
    pipe?: Pipe<SetOutput<TValue>>
  ): SetSchema<TValue>;

  /**
   * Creates a set schema.
   *
   * @param value The value schema.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A set schema.
   */
  <const TValue extends BaseSchema>(
    value: TValue,
    message?: ErrorMessage,
    pipe?: Pipe<SetOutput<TValue>>
  ): SetSchema<TValue>;
}

export const set: SetSchemaFactory = <
  const TValue extends BaseSchema,
  const TOutput = SetOutput<TValue>
>(
  value: TValue,
  arg2?: Pipe<TOutput> | ErrorMessage,
  arg3?: Pipe<TOutput>
) => new SetSchema(value, arg2, arg3);

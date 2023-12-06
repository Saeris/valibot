import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Number schema type.
 */
export class NumberSchema<const TOutput = number> extends BaseSchema<
  number,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'number';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: Pipe<TOutput>;

  constructor(arg1?: Pipe<TOutput> | ErrorMessage, arg2?: Pipe<TOutput>) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg1, arg2);
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'number' || isNaN(input)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, this.type);
  }
}

export interface NumberSchemaFactory {
  /**
   * Creates a number schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns A number schema.
   */
  (pipe?: Pipe<number>): NumberSchema;

  /**
   * Creates a number schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A number schema.
   */
  (message?: ErrorMessage, pipe?: Pipe<number>): NumberSchema;
}

export const number: NumberSchemaFactory = (
  arg1?: Pipe<number> | ErrorMessage,
  arg2?: Pipe<number>
) => new NumberSchema(arg1, arg2);

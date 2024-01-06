import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * String schema type.
 */
export class StringSchema<TOutput = string> extends BaseSchema<
  string,
  TOutput
> {
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
    if (typeof input !== 'string') {
      return schemaIssue(info, 'type', 'string', this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, 'string');
  }
}

export interface StringSchemaFactory {
  /**
   * Creates a string schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns A string schema.
   */
  (pipe?: Pipe<string>): StringSchema;

  /**
   * Creates a string schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A string schema.
   */
  (message?: ErrorMessage, pipe?: Pipe<string>): StringSchema;
}

export const string: StringSchemaFactory = (
  arg1?: Pipe<string> | ErrorMessage,
  arg2?: Pipe<string>
) => new StringSchema(arg1, arg2);

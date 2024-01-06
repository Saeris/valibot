import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Bigint schema type.
 */
export class BigintSchema<TOutput = bigint> extends BaseSchema<
  bigint,
  TOutput
> {
  /**
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
    if (typeof input !== 'bigint') {
      return schemaIssue(info, 'type', 'bigint', this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, 'bigint');
  }
}

export interface BaseSchemaFactory {
  /**
   * Creates a bigint schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns A bigint schema.
   */
  (pipe?: Pipe<bigint>): BigintSchema;

  /**
   * Creates a bigint schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A bigint schema.
   */
  (message?: ErrorMessage, pipe?: Pipe<bigint>): BigintSchema;
}

export const bigint: BaseSchemaFactory = (
  arg1?: Pipe<bigint> | ErrorMessage,
  arg2?: Pipe<bigint>
) => new BigintSchema(arg1, arg2);

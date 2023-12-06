import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * Bigint schema async type.
 */
export class BigintSchemaAsync<TOutput = bigint> extends BaseSchemaAsync<
  bigint,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'bigint';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  constructor(
    arg1?: ErrorMessage | PipeAsync<TOutput>,
    arg2?: PipeAsync<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg1, arg2);
    this.message = message;
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'bigint') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

export interface BigintSchemaAsyncFactory {
  /**
   * Creates an async bigint schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async bigint schema.
   */
  (pipe?: PipeAsync<bigint>): BigintSchemaAsync;

  /**
   * Creates an async bigint schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async bigint schema.
   */
  (message?: ErrorMessage, pipe?: PipeAsync<bigint>): BigintSchemaAsync;
}

export const bigintAsync: BigintSchemaAsyncFactory = (
  arg1?: ErrorMessage | PipeAsync<bigint>,
  arg2?: PipeAsync<bigint>
) => new BigintSchemaAsync(arg1, arg2);

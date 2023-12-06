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
 * Number schema async type.
 */
export class NumberSchemaAsync<TOutput = number> extends BaseSchemaAsync<
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

  async _parse(input: number, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'number' || isNaN(input)) {
      return schemaIssue(info, 'type', 'number', this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, 'number');
  }
}

export interface NumberSchemaAsyncFactory {
  /**
   * Creates an async number schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async number schema.
   */
  (pipe?: PipeAsync<number>): NumberSchemaAsync;

  /**
   * Creates an async number schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async number schema.
   */
  (message?: ErrorMessage, pipe?: PipeAsync<number>): NumberSchemaAsync;
}

export const numberAsync: NumberSchemaAsyncFactory = (
  arg1?: ErrorMessage | PipeAsync<number>,
  arg2?: PipeAsync<number>
) => new NumberSchemaAsync(arg1, arg2);

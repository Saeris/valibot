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
 * String schema async type.
 */
export class StringSchemaAsync<TOutput = string> extends BaseSchemaAsync<
  string,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'string';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  constructor(
    arg1?: PipeAsync<TOutput> | ErrorMessage,
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
    if (typeof input !== 'string') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

export interface StringSchemaAsyncFactory {
  /**
   * Creates an async string schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async string schema.
   */
  (pipe?: PipeAsync<string>): StringSchemaAsync;

  /**
   * Creates an async string schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async string schema.
   */
  (message?: ErrorMessage, pipe?: PipeAsync<string>): StringSchemaAsync;
}

export const stringAsync: StringSchemaAsyncFactory = (
  arg1?: PipeAsync<string> | ErrorMessage,
  arg2?: PipeAsync<string>
) => new StringSchemaAsync(arg1, arg2);

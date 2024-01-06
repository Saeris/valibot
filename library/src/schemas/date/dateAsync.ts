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
 * Date schema async type.
 */
export class DateSchemaAsync<TOutput = Date> extends BaseSchemaAsync<
  Date,
  TOutput
> {
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
    if (!(input instanceof Date) || isNaN(input.getTime())) {
      return schemaIssue(info, 'type', 'date', this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, 'date');
  }
}

export interface DateSchemaAsyncFactory {
  /**
   * Creates an async date schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async date schema.
   */
  (pipe?: PipeAsync<Date>): DateSchemaAsync;

  /**
   * Creates an async date schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async date schema.
   */
  (message?: ErrorMessage, pipe?: PipeAsync<Date>): DateSchemaAsync;
}

export const dateAsync: DateSchemaAsyncFactory = (
  arg1?: PipeAsync<Date> | ErrorMessage,
  arg2?: PipeAsync<Date>
) => new DateSchemaAsync(arg1, arg2);

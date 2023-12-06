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
 * Boolean schema async type.
 */
export class BooleanSchemaAsync<TOutput = boolean> extends BaseSchemaAsync<
  boolean,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'boolean';
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
    if (typeof input !== 'boolean') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

export interface BooleanSchemaAsyncFactory {
  /**
   * Creates an async boolean schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async boolean schema.
   */
  (pipe?: PipeAsync<boolean>): BooleanSchemaAsync;

  /**
   * Creates an async boolean schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async boolean schema.
   */
  (message?: ErrorMessage, pipe?: PipeAsync<boolean>): BooleanSchemaAsync;
}

export const booleanAsync: BooleanSchemaAsyncFactory = (
  arg1?: PipeAsync<boolean> | ErrorMessage,
  arg2?: PipeAsync<boolean>
) => new BooleanSchemaAsync(arg1, arg2);

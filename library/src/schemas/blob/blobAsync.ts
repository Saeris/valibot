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
 * Blob schema async type.
 */
export class BlobSchemaAsync<TOutput = Blob> extends BaseSchemaAsync<
  Blob,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'blob';
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
    if (!(input instanceof Blob)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

export interface BlobSchemaAsyncFactory {
  /**
   * Creates an async blob schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async blob schema.
   */
  (pipe?: PipeAsync<Blob>): BlobSchemaAsync;

  /**
   * Creates an async blob schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async blob schema.
   */
  (message?: ErrorMessage, pipe?: PipeAsync<Blob>): BlobSchemaAsync;
}

export const blobAsync: BlobSchemaAsyncFactory = (
  arg1?: ErrorMessage | PipeAsync<Blob>,
  arg2?: PipeAsync<Blob>
) => new BlobSchemaAsync(arg1, arg2);

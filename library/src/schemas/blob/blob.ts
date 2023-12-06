import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Blob schema type.
 */
export class BlobSchema<const TOutput = Blob> extends BaseSchema<
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
    if (!(input instanceof Blob)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, this.type);
  }
}

export interface BlobSchemaFactory {
  /**
   * Creates a blob schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns A blob schema.
   */
  (pipe?: Pipe<Blob>): BlobSchema;

  /**
   * Creates a blob schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A blob schema.
   */
  (message?: ErrorMessage, pipe?: Pipe<Blob>): BlobSchema;
}

export const blob: BlobSchemaFactory = (
  arg1?: Pipe<Blob> | ErrorMessage,
  arg2?: Pipe<Blob>
) => new BlobSchema(arg1, arg2);

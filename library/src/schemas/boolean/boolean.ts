import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Boolean schema type.
 */
export class BooleanSchema<const TOutput = boolean> extends BaseSchema<
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
    if (typeof input !== 'boolean') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, this.type);
  }
}

export interface BooleanSchemaFactory {
  /**
   * Creates a boolean schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns A boolean schema.
   */
  (pipe?: Pipe<boolean>): BooleanSchema;

  /**
   * Creates a boolean schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A boolean schema.
   */
  (message?: ErrorMessage, pipe?: Pipe<boolean>): BooleanSchema;
}

export const boolean: BooleanSchemaFactory = (
  arg1?: Pipe<boolean> | ErrorMessage,
  arg2?: Pipe<boolean>
) => new BooleanSchema(arg1, arg2);

import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Date schema type.
 */
export class DateSchema<TOutput = Date> extends BaseSchema<Date, TOutput> {
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
    if (!(input instanceof Date) || isNaN(input.getTime())) {
      return schemaIssue(info, 'type', 'date', this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, 'date');
  }
}

export interface DateSchemaFactory {
  /**
   * Creates a date schema.
   *
   * @param pipe A validation and transformation pipe.
   *
   * @returns A date schema.
   */
  (pipe?: Pipe<Date>): DateSchema;

  /**
   * Creates a date schema.
   *
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A date schema.
   */
  (message?: ErrorMessage, pipe?: Pipe<Date>): DateSchema;
}

export const date: DateSchemaFactory = (
  arg1?: Pipe<Date> | ErrorMessage,
  arg2?: Pipe<Date>
) => new DateSchema(arg1, arg2);

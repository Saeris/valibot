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
   * The schema type.
   */
  readonly type = 'date';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: Pipe<TOutput>;

  constructor(arg1?: ErrorMessage | Pipe<TOutput>, arg2?: Pipe<TOutput>) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg1, arg2);
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(input instanceof Date) || isNaN(input.getTime())) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, this.type);
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
  arg1?: ErrorMessage | Pipe<Date>,
  arg2?: Pipe<Date>
) => new DateSchema(arg1, arg2);

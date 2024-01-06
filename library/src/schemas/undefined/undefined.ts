import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Undefined schema type.
 */
export class UndefinedSchema<TOutput = undefined> extends BaseSchema<
  undefined,
  TOutput
> {
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(message: ErrorMessage = 'Invalid type') {
    super();
    this.message = message;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'undefined') {
      return schemaIssue(info, 'type', 'undefined', this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a undefined schema.
 *
 * @param message The error message.
 *
 * @returns A undefined schema.
 */
export const undefined_ = (message?: ErrorMessage) =>
  new UndefinedSchema(message);

/**
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;

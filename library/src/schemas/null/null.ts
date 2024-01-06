import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export class NullSchema<TOutput = null> extends BaseSchema<null, TOutput> {
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
    if (input !== null) {
      return schemaIssue(info, 'type', `null`, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a null schema.
 *
 * @param message The error message.
 *
 * @returns A null schema.
 */
export const null_ = (message?: ErrorMessage) => new NullSchema(message);

/**
 * See {@link null_}
 *
 * @deprecated Use `null_` instead.
 */
export const nullType = null_;

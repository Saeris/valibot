import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export class VoidSchema<TOutput = void> extends BaseSchema<void, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'void';
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
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a void schema.
 *
 * @param message The error message.
 *
 * @returns A void schema.
 */
export const void_ = (message?: ErrorMessage) => new VoidSchema(message);

/**
 * See {@link void_}
 *
 * @deprecated Use `void_` instead.
 */
export const voidType = void_;

import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * NaN schema type.
 */
export class NanSchema<TOutput = number> extends BaseSchema<number, TOutput> {
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
    if (!Number.isNaN(input)) {
      return schemaIssue(info, 'type', 'nan', this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a NaN schema.
 *
 * @param message The error message.
 *
 * @returns A NaN schema.
 */
export const nan = (message?: ErrorMessage) => new NanSchema(message);

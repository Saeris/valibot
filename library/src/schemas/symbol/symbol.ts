import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Symbol schema type.
 */
export class SymbolSchema<TOutput = symbol> extends BaseSchema<
  symbol,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'symbol';
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
    if (typeof input !== 'symbol') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a symbol schema.
 *
 * @param message The error message.
 *
 * @returns A symbol schema.
 */
export const symbol = (message?: ErrorMessage) => new SymbolSchema(message);

import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Symbol schema async type.
 */
export class SymbolSchemaAsync<TOutput = symbol> extends BaseSchemaAsync<
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'symbol') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async symbol schema.
 *
 * @param message The error message.
 *
 * @returns An async symbol schema.
 */
export const symbolAsync = (message?: ErrorMessage) =>
  new SymbolSchemaAsync(message);

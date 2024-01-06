import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export class NullSchemaAsync<TOutput = null> extends BaseSchemaAsync<
  null,
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (input !== null) {
      return schemaIssue(info, 'type', 'null', this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async null schema.
 *
 * @param message The error message.
 *
 * @returns An async null schema.
 */
export const nullAsync = (message?: ErrorMessage) =>
  new NullSchemaAsync(message);

/**
 * See {@link nullAsync}
 *
 * @deprecated Use `nullAsync` instead.
 */
export const nullTypeAsync = nullAsync;

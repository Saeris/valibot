import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Undefined schema async type.
 */
export class UndefinedSchemaAsync<TOutput = undefined> extends BaseSchemaAsync<
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'undefined') {
      return schemaIssue(info, 'type', 'undefined', this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async undefined schema.
 *
 * @param message The error message.
 *
 * @returns An async undefined schema.
 */
export const undefinedAsync = (message?: ErrorMessage) =>
  new UndefinedSchemaAsync(message);

/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
export const undefinedTypeAsync = undefinedAsync;

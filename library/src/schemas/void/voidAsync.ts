import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export class VoidSchemaAsync<TOutput = void> extends BaseSchemaAsync<
  void,
  TOutput
> {
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (typeof input !== 'undefined') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async void schema.
 *
 * @param message The error message.
 *
 * @returns An async void schema.
 */
export const voidAsync = (message?: ErrorMessage) =>
  new VoidSchemaAsync(message);

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;

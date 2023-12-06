import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * NaN schema async type.
 */
export class NanSchemaAsync<const TOutput = number> extends BaseSchemaAsync<
  number,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'nan';
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
    if (!Number.isNaN(input)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async NaN schema.
 *
 * @param message The error message.
 *
 * @returns An async NaN schema.
 */
export const nanAsync = (message?: ErrorMessage) => new NanSchemaAsync(message);

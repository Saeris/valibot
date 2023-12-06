import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Never schema async type.
 */
export class NeverSchemaAsync extends BaseSchemaAsync<never> {
  /**
   * The schema type.
   */
  readonly type = 'never';
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(message: ErrorMessage = 'Invalid type') {
    super();
    this.message = message;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    return schemaIssue(info, 'type', this.type, this.message, input);
  }
}

/**
 * Creates an async never schema.
 *
 * @param message The error message.
 *
 * @returns An async never schema.
 */
export const neverAsync = (message?: ErrorMessage) =>
  new NeverSchemaAsync(message);

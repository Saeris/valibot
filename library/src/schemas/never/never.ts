import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Never schema type.
 */
export class NeverSchema extends BaseSchema<never> {
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(message: ErrorMessage = 'Invalid type') {
    super();
    this.message = message;
  }

  _parse(input: unknown, info?: ParseInfo) {
    return schemaIssue(info, 'type', 'never', this.message, input);
  }
}

/**
 * Creates a never schema.
 *
 * @param message The error message.
 *
 * @returns A never schema.
 */
export const never = (message?: ErrorMessage) => new NeverSchema(message);

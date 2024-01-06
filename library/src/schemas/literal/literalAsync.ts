import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema async type.
 */
export class LiteralSchemaAsync<
  TLiteral extends Literal,
  TOutput = TLiteral
> extends BaseSchemaAsync<TLiteral, TOutput> {
  /**
   * The literal value.
   */
  literal: TLiteral;
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(literal: TLiteral, message: ErrorMessage = 'Invalid type') {
    super();
    this.literal = literal;
    this.message = message;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (input !== this.literal) {
      return schemaIssue(info, 'type', 'literal', this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async literal schema.
 *
 * @param literal The literal value.
 * @param message The error message.
 *
 * @returns An async literal schema.
 */
export const literalAsync = <TLiteral extends Literal>(
  literal: TLiteral,
  message?: ErrorMessage
) => new LiteralSchemaAsync(literal, message);

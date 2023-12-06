import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema type.
 */
export class LiteralSchema<
  TLiteral extends Literal,
  TOutput = TLiteral
> extends BaseSchema<TLiteral, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'literal';
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

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (input !== this.literal) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a literal schema.
 *
 * @param literal The literal value.
 * @param message The error message.
 *
 * @returns A literal schema.
 */
export const literal = <TLiteral extends Literal>(
  literal: TLiteral,
  message?: ErrorMessage
) => new LiteralSchema(literal, message);

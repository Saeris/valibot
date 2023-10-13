import type { BaseSchema, ErrorMessage, ParseInfo } from '../../types.ts';
import { getSchemaIssues, getOutput, assign } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema type.
 */
export type LiteralSchema<
  TLiteral extends Literal,
  TOutput = TLiteral
> = BaseSchema<TLiteral, TOutput> & {
  kind: 'literal';
  /**
   * The literal value.
   */
  literal: TLiteral;
};

/**
 * Creates a literal schema.
 *
 * @param literal The literal value.
 * @param error The error message.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal: TLiteral,
  error?: ErrorMessage
): LiteralSchema<TLiteral> {
  return assign(
    (input: unknown, info?: ParseInfo) => {
      // Check type of input
      if (input !== literal) {
        return getSchemaIssues(
          info,
          'type',
          'literal',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as TLiteral);
    },
    {
      kind: 'literal',
      async: false,
      literal,
    } as const
  );
}

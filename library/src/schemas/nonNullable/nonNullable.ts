import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Output,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export class NonNullableSchema<
  const TWrapped extends BaseSchema,
  const TOutput = NonNullable<Output<TWrapped>>
> extends BaseSchema<NonNullable<Input<TWrapped>>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'non_nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(wrapped: TWrapped, message: ErrorMessage = 'Invalid type') {
    super();
    this.wrapped = wrapped;
    this.message = message;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Allow `null` values not to pass
    if (input === null) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullable schema.
 */
export const nonNullable = <const TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: ErrorMessage
) => new NonNullableSchema(wrapped, message);

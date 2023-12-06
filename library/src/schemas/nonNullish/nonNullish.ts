import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Output,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Non nullish type.
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish schema type.
 */
export class NonNullishSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullish<Output<TWrapped>>
> extends BaseSchema<NonNullish<Input<TWrapped>>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'non_nullish';
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
    // Allow `null` and `undefined` values not to pass
    if (input === null || input === undefined) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullish schema.
 */
export const nonNullish = <TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: ErrorMessage
) => new NonNullishSchema(wrapped, message);

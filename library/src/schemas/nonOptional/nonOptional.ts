import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Output,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export class NonOptionalSchema<
  const TWrapped extends BaseSchema,
  const TOutput = NonOptional<Output<TWrapped>>
> extends BaseSchema<NonOptional<Input<TWrapped>>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'non_optional';
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
    // Allow `undefined` values not to pass
    if (input === undefined) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non optional schema.
 */
export const nonOptional = <const TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: ErrorMessage
) => new NonOptionalSchema(wrapped, message);

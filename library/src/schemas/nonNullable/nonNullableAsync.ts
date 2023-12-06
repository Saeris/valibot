import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Output,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonNullable } from './nonNullable.ts';

/**
 * Non nullable schema async type.
 */
export class NonNullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullable<Output<TWrapped>>
> extends BaseSchemaAsync<NonNullable<Input<TWrapped>>, TOutput> {
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Allow `null` values not to pass
    if (input === null) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

/**
 * Creates an async non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non nullable schema.
 */
export const nonNullableAsync = <TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message?: ErrorMessage
) => new NonNullableSchemaAsync(wrapped, message);

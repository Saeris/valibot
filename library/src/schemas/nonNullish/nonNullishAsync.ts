import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Output,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonNullish } from './nonNullish.ts';

/**
 * Non nullish schema async type.
 */
export class NonNullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullish<Output<TWrapped>>
> extends BaseSchemaAsync<NonNullish<Input<TWrapped>>, TOutput> {
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
    // Allow `null` and `undefined` values not to pass
    if (input === null || input === undefined) {
      return schemaIssue(info, 'type', 'non_nullish', this.message, input);
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

/**
 * Creates an async non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non nullish schema.
 */
export const nonNullishAsync = <TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message?: ErrorMessage
) => new NonNullishSchemaAsync(wrapped, message);

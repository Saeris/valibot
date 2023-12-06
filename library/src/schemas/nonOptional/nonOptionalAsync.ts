import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Output,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonOptional } from './nonOptional.ts';

/**
 * Non optional schema async type.
 */
export class NonOptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonOptional<Output<TWrapped>>
> extends BaseSchemaAsync<NonOptional<Input<TWrapped>>, TOutput> {
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Allow `undefined` values not to pass
    if (input === undefined) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

/**
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non optional schema.
 */
export const nonOptionalAsync = <TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message?: ErrorMessage
) => new NonOptionalSchemaAsync(wrapped, message);

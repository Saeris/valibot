import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
  ParseInfoAsync,
} from '../../types.ts';
import { assign, getSchemaIssues } from '../../utils/index.ts';
import type { NonOptional } from './nonOptional.ts';

/**
 * Non optional schema async type.
 */
export type NonOptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonOptional<Output<TWrapped>>
> = BaseSchemaAsync<NonOptional<Input<TWrapped>>, TOutput> & {
  kind: 'non_optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non optional schema.
 */
export function nonOptionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonOptionalSchemaAsync<TWrapped> {
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_optional',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped(input, info);
    },
    {
      kind: 'non_optional',
      async: true,
      wrapped,
    } as const
  );
}

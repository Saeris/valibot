import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';
import type { NonNullable } from './nonNullable.ts';

/**
 * Non nullable schema async type.
 */
export type NonNullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullable<Output<TWrapped>>
> = BaseSchemaAsync<NonNullable<Input<TWrapped>>, TOutput> & {
  kind: 'non_nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates an async non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullable schema.
 */
export function nonNullableAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonNullableSchemaAsync<TWrapped> {
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Prevent `null` values from passing
      if (input === null) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullable',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped(input, info);
    },
    {
      kind: 'non_nullable',
      async: true,
      wrapped,
    } as const
  );
}

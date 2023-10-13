import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
  ParseInfo,
} from '../../types.ts';
import { assign, getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export type NonNullableSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullable<Output<TWrapped>>
> = BaseSchema<NonNullable<Input<TWrapped>>, TOutput> & {
  kind: 'non_nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonNullableSchema<TWrapped> {
  return assign(
    (input: unknown, info?: ParseInfo) => {
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
      async: false,
      wrapped,
    } as const
  );
}

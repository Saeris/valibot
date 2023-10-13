import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
  ParseInfo,
} from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullish type.
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish schema type.
 */
export type NonNullishSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullish<Output<TWrapped>>
> = BaseSchema<NonNullish<Input<TWrapped>>, TOutput> & {
  kind: 'non_nullish';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonNullishSchema<TWrapped> {
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      // Prevent `null` and `undefined` values from passing
      if (input === null || input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullish',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped(input, info);
    },
    {
      kind: 'non_nullish',
      async: false,
      wrapped,
    } as const
  );
}

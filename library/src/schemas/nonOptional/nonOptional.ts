import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
  ParseInfo,
} from '../../types.ts';
import { assign, getSchemaIssues } from '../../utils/index.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = NonOptional<Output<TWrapped>>
> = BaseSchema<NonOptional<Input<TWrapped>>, TOutput> & {
  kind: 'non_optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonOptionalSchema<TWrapped> {
  return assign(
    (input: unknown, info?: ParseInfo) => {
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
      async: false,
      wrapped,
    } as const
  );
}

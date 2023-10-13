import type { BaseSchema, Input, Output, ParseInfo } from '../../types.ts';
import { assign, getOutput } from '../../utils/index.ts';

/**
 * Optional schema type.
 */
export type OptionalSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends undefined
    ? Output<TWrapped> | undefined
    : Output<TWrapped>
> = BaseSchema<Input<TWrapped> | undefined, TOutput> & {
  kind: 'optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The default value.
   */
  get default(): TDefault;
};

/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A optional schema.
 */
export function optional<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): OptionalSchema<TWrapped, TDefault> {
  const getDefault = () =>
    typeof default_ === 'function'
      ? (default_ as () => TDefault)()
      : (default_ as TDefault);

  return assign(
    (input: unknown, info?: ParseInfo) => {
      // Get default or input value
      const value = input === undefined ? getDefault() : input;

      // Allow `undefined` value to pass
      if (value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped(value, info);
    },
    {
      kind: 'optional',
      async: false,
      wrapped,
      get default() {
        return getDefault();
      },
    } as const
  );
}

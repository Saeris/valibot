import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ParseInfoAsync,
} from '../../types.ts';
import { assign, getOutput } from '../../utils/index.ts';

/**
 * Nullish schema async type.
 */
export type NullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends undefined
    ? Output<TWrapped> | null | undefined
    : Output<TWrapped>
> = BaseSchemaAsync<Input<TWrapped> | null | undefined, TOutput> & {
  kind: 'nullish';
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
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullishSchemaAsync<TWrapped, TDefault> {
  const getDefault = () =>
    typeof default_ === 'function'
      ? (default_ as () => TDefault)()
      : (default_ as TDefault);

  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Get default or input value
      let default_: Awaited<TDefault>;
      const value =
        (input === null || input === undefined) &&
        (default_ = await getDefault()) &&
        default_ !== undefined
          ? default_
          : input;

      // Allow `null` or `undefined` value to pass
      if (value === null || value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped(value, info);
    },
    {
      kind: 'nullish',
      async: true,
      wrapped,
      get default() {
        return getDefault();
      },
    } as const
  );
}

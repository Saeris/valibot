import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ParseInfoAsync,
} from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullable schema async type.
 */
export type NullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends undefined
    ? Output<TWrapped> | null
    : Output<TWrapped>
> = BaseSchemaAsync<Input<TWrapped> | null, TOutput> & {
  kind: 'nullable';
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
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullableSchemaAsync<TWrapped, TDefault> {
  const getDefault = () =>
    typeof default_ === 'function'
      ? (default_ as () => TDefault)()
      : (default_ as TDefault);

  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Get default or input value
      let default_: Awaited<TDefault>;
      const value =
        input === null &&
        (default_ = await getDefault()) &&
        default_ !== undefined
          ? default_
          : input;

      // Allow `null` value to pass
      if (value === null) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped(value, info);
    },
    {
      kind: 'nullable',
      async: true,
      wrapped,
      get default() {
        return getDefault();
      },
    } as const
  );
}

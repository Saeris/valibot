import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type Input,
  type Output,
} from '../../types/index.ts';
import { getDefaultAsync } from '../../methods/index.ts';
import { parseResult } from '../../utils/index.ts';

/**
 * Nullable schema async type.
 */
export class NullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
  TOutput = Awaited<TDefault> extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null
> extends BaseSchemaAsync<Input<TWrapped> | null, TOutput> {
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  default: TDefault;

  constructor(wrapped: TWrapped, default_?: TDefault) {
    super();
    this.wrapped = wrapped;
    this.default = default_ as TDefault;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Allow `null` to pass or override it with default value
    if (input === null) {
      const override = await getDefaultAsync(this);
      if (override === undefined) {
        return parseResult(true, input);
      }
      input = override;
    }

    // Return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

export interface NullableSchemaAsyncFactory {
  /**
   * Creates an async nullable schema.
   *
   * @param wrapped The wrapped schema.
   *
   * @returns An async nullable schema.
   */
  <TWrapped extends BaseSchema | BaseSchemaAsync>(
    wrapped: TWrapped
  ): NullableSchemaAsync<TWrapped>;

  /**
   * Creates an async nullable schema.
   *
   * @param wrapped The wrapped schema.
   * @param default_ The default value.
   *
   * @returns An async nullable schema.
   */
  <
    TWrapped extends BaseSchema | BaseSchemaAsync,
    TDefault extends
      | Input<TWrapped>
      | (() =>
          | Input<TWrapped>
          | Promise<Input<TWrapped> | undefined>
          | undefined)
      | undefined
  >(
    wrapped: TWrapped,
    default_: TDefault
  ): NullableSchemaAsync<TWrapped, TDefault>;
}

export const nullableAsync: NullableSchemaAsyncFactory = <
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault
) => new NullableSchemaAsync(wrapped, default_);

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
 * Nullish schema async type.
 */
export class NullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
  TOutput = Awaited<TDefault> extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null | undefined
> extends BaseSchemaAsync<Input<TWrapped> | null | undefined, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'nullish';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Retutns the default value.
   */
  default: TDefault;

  constructor(wrapped: TWrapped, default_?: TDefault) {
    super();
    this.wrapped = wrapped;
    this.default = default_ as TDefault;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Allow `null` or `undefined` to pass or override it with default value
    if (input === null || input === undefined) {
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

export interface NullishSchemaAsyncFactory {
  /**
   * Creates an async nullish schema.
   *
   * @param wrapped The wrapped schema.
   *
   * @returns An async nullish schema.
   */
  <TWrapped extends BaseSchema | BaseSchemaAsync>(
    wrapped: TWrapped
  ): NullishSchemaAsync<TWrapped>;

  /**
   * Creates an async nullish schema.
   *
   * @param wrapped The wrapped schema.
   * @param default_ The default value.
   *
   * @returns An async nullish schema.
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
  ): NullishSchemaAsync<TWrapped, TDefault>;
}

export const nullishAsync: NullishSchemaAsyncFactory = <
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault
) => new NullishSchemaAsync(wrapped, default_);

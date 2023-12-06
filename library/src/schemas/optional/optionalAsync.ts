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
 * Optional schema async type.
 */
export class OptionalSchemaAsync<
  const TWrapped extends BaseSchema | BaseSchemaAsync,
  const TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
  const TOutput = Awaited<TDefault> extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | undefined
> extends BaseSchemaAsync<Input<TWrapped> | undefined, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'optional';
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
    // Allow `undefined` to pass or override it with default value
    if (input === undefined) {
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

export interface OptionalSchemaAsyncFactory {
  /**
   * Creates an async optional schema.
   *
   * @param wrapped The wrapped schema.
   *
   * @returns An async optional schema.
   */
  <const TWrapped extends BaseSchema | BaseSchemaAsync>(
    wrapped: TWrapped
  ): OptionalSchemaAsync<TWrapped>;

  /**
   * Creates an async optional schema.
   *
   * @param wrapped The wrapped schema.
   * @param default_ The default value.
   *
   * @returns An async optional schema.
   */
  <
    const TWrapped extends BaseSchema | BaseSchemaAsync,
    const TDefault extends
      | Input<TWrapped>
      | (() =>
          | Input<TWrapped>
          | Promise<Input<TWrapped> | undefined>
          | undefined)
      | undefined
  >(
    wrapped: TWrapped,
    default_: TDefault
  ): OptionalSchemaAsync<TWrapped, TDefault>;
}

export const optionalAsync: OptionalSchemaAsyncFactory = <
  const TWrapped extends BaseSchema | BaseSchemaAsync,
  const TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault
) => new OptionalSchemaAsync(wrapped, default_);

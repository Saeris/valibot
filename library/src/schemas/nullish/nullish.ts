import {
  BaseSchema,
  type ParseInfo,
  type Input,
  type Output,
} from '../../types/index.ts';
import { getDefault } from '../../methods/index.ts';
import { parseResult } from '../../utils/index.ts';

/**
 * Nullish schema type.
 */
export class NullishSchema<
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null | undefined
> extends BaseSchema<Input<TWrapped> | null | undefined, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'nullish';
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

  _parse(input: unknown, info?: ParseInfo) {
    // Allow `null` or `undefined` to pass or override it with default value
    if (input === null || input === undefined) {
      const override = getDefault(this);
      if (override === undefined) {
        return parseResult(true, input);
      }
      input = override;
    }

    // Otherwise, return result of wrapped schema
    return this.wrapped._parse(input, info);
  }
}

export interface NullishSchemaFactory {
  /**
   * Creates a nullish schema.
   *
   * @param wrapped The wrapped schema.
   *
   * @returns A nullish schema.
   */
  <TWrapped extends BaseSchema>(wrapped: TWrapped): NullishSchema<TWrapped>;

  /**
   * Creates a nullish schema.
   *
   * @param wrapped The wrapped schema.
   * @param default_ The default value.
   *
   * @returns A nullish schema.
   */
  <
    TWrapped extends BaseSchema,
    TDefault extends
      | Input<TWrapped>
      | (() => Input<TWrapped> | undefined)
      | undefined
  >(
    wrapped: TWrapped,
    default_: TDefault
  ): NullishSchema<TWrapped, TDefault>;
}

export const nullish: NullishSchemaFactory = <
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault
) => new NullishSchema(wrapped, default_);

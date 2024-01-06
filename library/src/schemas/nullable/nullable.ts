import {
  BaseSchema,
  type ParseInfo,
  type Input,
  type Output,
} from '../../types/index.ts';
import { getDefault } from '../../methods/index.ts';
import { parseResult } from '../../utils/index.ts';

/**
 * Nullable schema type.
 */
export class NullableSchema<
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null
> extends BaseSchema<Input<TWrapped> | null, TOutput> {
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The default value.
   */
  default: TDefault;

  constructor(wrapped: TWrapped, default_?: TDefault) {
    super();
    this.wrapped = wrapped;
    this.default = default_ as TDefault;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Allow `null` to pass or override it with default value
    if (input === null) {
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

export interface NullableSchemaFactory {
  /**
   * Creates a nullable schema.
   *
   * @param wrapped The wrapped schema.
   *
   * @returns A nullable schema.
   */
  <TWrapped extends BaseSchema>(wrapped: TWrapped): NullableSchema<TWrapped>;

  /**
   * Creates a nullable schema.
   *
   * @param wrapped The wrapped schema.
   * @param default_ The default value.
   *
   * @returns A nullable schema.
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
  ): NullableSchema<TWrapped, TDefault>;
}

export const nullable: NullableSchemaFactory = <
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault
) => new NullableSchema(wrapped, default_);

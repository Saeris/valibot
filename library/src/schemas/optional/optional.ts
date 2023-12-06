import {
  BaseSchema,
  type ParseInfo,
  type Input,
  type Output,
} from '../../types/index.ts';
import { getDefault } from '../../methods/index.ts';
import { parseResult } from '../../utils/index.ts';

/**
 * Optional schema type.
 */
export class OptionalSchema<
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | undefined
> extends BaseSchema<Input<TWrapped> | undefined, TOutput> {
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

  _parse(input: unknown, info?: ParseInfo) {
    // Allow `undefined` to pass or override it with default value
    if (input === undefined) {
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

export interface OptionalSchemaFactory {
  /**
   * Creates a optional schema.
   *
   * @param wrapped The wrapped schema.
   *
   * @returns A optional schema.
   */
  <TWrapped extends BaseSchema>(wrapped: TWrapped): OptionalSchema<TWrapped>;

  /**
   * Creates a optional schema.
   *
   * @param wrapped The wrapped schema.
   * @param default_ The default value.
   *
   * @returns A optional schema.
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
  ): OptionalSchema<TWrapped, TDefault>;
}

export const optional: OptionalSchemaFactory = <
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault
) => new OptionalSchema(wrapped, default_);

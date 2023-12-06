import {
  BaseSchema,
  type ParseInfo,
  type Input,
  type Output,
} from '../../types/index.ts';

/**
 * Recursive schema type.
 */
export class RecursiveSchema<
  const TSchemaGetter extends () => BaseSchema,
  const TOutput = Output<ReturnType<TSchemaGetter>>
> extends BaseSchema<Input<ReturnType<TSchemaGetter>>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'recursive';
  /**
   * The schema getter.
   */
  getter: TSchemaGetter;

  constructor(getter: TSchemaGetter) {
    super();
    this.getter = getter;
  }

  _parse(input: unknown, info?: ParseInfo) {
    return this.getter()._parse(input, info);
  }
}

/**
 * Creates a recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns A recursive schema.
 */
export const recursive = <const TSchemaGetter extends () => BaseSchema>(
  getter: TSchemaGetter
) => new RecursiveSchema(getter);

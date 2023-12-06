import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type Input,
  type Output,
} from '../../types/index.ts';

/**
 * Recursive schema async type.
 */
export class RecursiveSchemaAsync<
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync,
  TOutput = Output<ReturnType<TSchemaGetter>>
> extends BaseSchemaAsync<Input<ReturnType<TSchemaGetter>>, TOutput> {
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

  async _parse(input: unknown, info?: ParseInfo) {
    return this.getter()._parse(input, info);
  }
}

/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async recursive schema.
 */
export const recursiveAsync = <
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync
>(
  getter: TSchemaGetter
) => new RecursiveSchemaAsync(getter);

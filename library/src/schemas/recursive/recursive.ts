import type { BaseSchema, Input, Output, ParseInfo } from '../../types.ts';
import { assign } from '../../utils/assign.ts';

/**
 * Recursive schema type.
 */
export type RecursiveSchema<
  TSchemaGetter extends () => BaseSchema,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchema<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  kind: 'recursive';
  /**
   * The schema getter.
   */
  getter: TSchemaGetter;
};

/**
 * Creates a recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns A recursive schema.
 */
export function recursive<TSchemaGetter extends () => BaseSchema>(
  getter: TSchemaGetter
): RecursiveSchema<TSchemaGetter> {
  return assign(
    (input: unknown, info?: ParseInfo) => {
      return getter()(input, info);
    },
    {
      kind: 'recursive',
      async: false,
      getter,
    } as const
  );
}

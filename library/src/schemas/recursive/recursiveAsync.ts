import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ParseInfoAsync,
} from '../../types.ts';

/**
 * Recursive schema async type.
 */
export type RecursiveSchemaAsync<
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchemaAsync<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  kind: 'recursive';
  /**
   * The schema getter.
   */
  getter: TSchemaGetter;
};

/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async recursive schema.
 */
export function recursiveAsync<
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync
>(getter: TSchemaGetter): RecursiveSchemaAsync<TSchemaGetter> {
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      return getter()(input, info);
    },
    {
      kind: 'recursive',
      async: true,
      getter,
    } as const
  );
}

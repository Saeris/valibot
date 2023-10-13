import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  ParseInfo,
} from '../../types.ts';

/**
 * Passes a default value to a schema in case of an undefined input.
 *
 * @deprecated Use `optional` instead.
 *
 * @param schema The affected schema.
 * @param value The default value.
 *
 * @returns The passed schema.
 */
export function withDefault<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  value: Input<TSchema> | (() => Input<TSchema>)
): TSchema {
  return Object.assign((input: unknown, info?: ParseInfo) => {
    return schema(
      input === undefined
        ? typeof value === 'function'
          ? (value as () => Input<TSchema>)()
          : value
        : input,
      info
    );
  }, schema);
}

/**
 * See {@link withDefault}
 *
 * @deprecated Use `optional` instead.
 */
export const useDefault = withDefault;

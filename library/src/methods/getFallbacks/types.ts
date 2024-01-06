import type {
  ObjectSchema,
  ObjectEntries,
  TupleSchema,
  ObjectSchemaAsync,
  ObjectEntriesAsync,
  TupleSchemaAsync,
} from '../../schemas/index.ts';
import type {
  FallbackValue,
  SchemaWithMaybeFallback,
  SchemaWithMaybeFallbackAsync,
} from '../getFallback/index.ts';

/**
 * Fallback values type.
 */
export type FallbackValues<
  TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync
> = TSchema extends ObjectSchema<infer TEntries extends ObjectEntries>
  ? { [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]> }
  : TSchema extends ObjectSchemaAsync<infer TEntries extends ObjectEntriesAsync>
  ? { [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]> }
  : TSchema extends TupleSchema<infer TItems>
  ? { [TKey in keyof TItems]: FallbackValues<TItems[TKey]> }
  : TSchema extends TupleSchemaAsync<infer TItems>
  ? { [TKey in keyof TItems]: FallbackValues<TItems[TKey]> }
  : FallbackValue<TSchema>;

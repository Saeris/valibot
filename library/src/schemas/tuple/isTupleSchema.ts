import type { TupleItemsAsync } from './tupleAsync.ts';
import { TupleSchemaAsync } from './tupleAsync.ts';
import type { TupleItems } from './tuple.ts';
import { TupleSchema } from './tuple.ts';
import { isSchema } from '../../utils/isSchema.ts';

export const isTupleSchema = (
  val: unknown
): val is
  | TupleSchema<TupleItems, any>
  | TupleSchemaAsync<TupleItemsAsync, any> =>
  isSchema(val) && val instanceof (TupleSchema || TupleSchemaAsync);

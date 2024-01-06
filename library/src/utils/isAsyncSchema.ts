import { BaseSchemaAsync } from '../types/schema.ts';

export const isAsyncSchema = <TAsyncSchema extends BaseSchemaAsync>(
  val: unknown
): val is TAsyncSchema => val instanceof BaseSchemaAsync;

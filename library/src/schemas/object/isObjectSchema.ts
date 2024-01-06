import type { ObjectEntriesAsync } from './objectAsync.ts';
import { ObjectSchemaAsync } from './objectAsync.ts';
import type { ObjectEntries } from './object.ts';
import { ObjectSchema } from './object.ts';
import { isSchema } from '../../utils/isSchema.ts';

export const isObjectSchema = (
  val: unknown
): val is
  | ObjectSchema<ObjectEntries, any>
  | ObjectSchemaAsync<ObjectEntriesAsync, any> =>
  isSchema(val) && val instanceof (ObjectSchema || ObjectSchemaAsync);

import type { BaseSchema, BaseSchemaAsync } from '../types.ts';

export const isBaseSchema = (
  val: unknown
): val is BaseSchema | BaseSchemaAsync =>
  typeof val === `function` &&
  `kind` in val &&
  typeof val.kind === `string` &&
  `async` in val &&
  typeof val.async === `boolean`;

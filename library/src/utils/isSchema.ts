import { Schema } from '../types/schema.ts';

export const isSchema = <TSchema extends Schema>(
  val: unknown
): val is TSchema => val instanceof Schema;

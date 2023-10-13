import type { BaseSchema, ParseInfo, Pipe, PipeMeta } from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
  kind: 'unknown';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates a unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
export function unknown(pipe: Pipe<unknown> = []): UnknownSchema {
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      return executePipe(input, pipe, info, 'unknown');
    },
    {
      kind: 'unknown',
      async: false,
      checks: getChecks(pipe),
    } as const
  );
}

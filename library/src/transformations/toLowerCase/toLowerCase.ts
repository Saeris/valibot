import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @returns A transformation function.
 */
export function toLowerCase() {
  return (input: string): PipeResult<string> =>
    getOutput(input.toLocaleLowerCase());
}

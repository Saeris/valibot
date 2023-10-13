import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = 'max_size' as const;
  const message = error ?? 'Invalid size';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      input.size > requirement
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

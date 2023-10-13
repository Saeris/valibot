import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The maximum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxLength<
  TInput extends string | any[],
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = 'max_length' as const;
  const message = error ?? 'Invalid length';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      input.length > requirement
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

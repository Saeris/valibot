import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function bytes<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement,
  error?: ErrorMessage
) {
  const kind = 'bytes' as const;
  const message = error ?? 'Invalid byte length';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      new TextEncoder().encode(input).length !== requirement
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

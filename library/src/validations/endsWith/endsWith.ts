import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function endsWith<
  TInput extends string,
  const TRequirement extends string
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = 'ends_with' as const;
  const message = error ?? 'Invalid end';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      !input.endsWith(requirement as any)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

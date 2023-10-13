import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function startsWith<
  TInput extends string,
  const TRequirement extends string
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = `starts_with` as const;
  const message = error ?? 'Invalid start';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      !input.startsWith(requirement as any)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

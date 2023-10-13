import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is an integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function integer<TInput extends number>(error?: ErrorMessage) {
  const kind = 'integer' as const;
  const message = error ?? 'Invalid integer';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      !Number.isInteger(input)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      message,
    }
  );
}

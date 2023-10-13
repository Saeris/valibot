import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: ErrorMessage) {
  const kind = 'finite' as const;
  const message = error ?? 'Invalid finite number';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      !Number.isFinite(input)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      message,
    }
  );
}

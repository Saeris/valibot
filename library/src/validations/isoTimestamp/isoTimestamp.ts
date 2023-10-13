import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a timestamp.
 *
 * Format: yyyy-mm-ddThh:mm:ss.sssZ
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTimestamp<TInput extends string>(error?: ErrorMessage) {
  const kind = 'iso_timestamp' as const;
  const requirement =
    /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T(0[0-9]|1\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/;
  const message = error ?? 'Invalid timestamp';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      !requirement.test(input)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

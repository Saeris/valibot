import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a week.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid even though the year 2021 has only
 * 52 weeks.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoWeek<TInput extends string>(error?: ErrorMessage) {
  const kind = 'iso_week' as const;
  const requirement = /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/;
  const message = error ?? 'Invalid week';
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

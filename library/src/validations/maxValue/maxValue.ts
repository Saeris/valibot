import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the value of a string, number or date.
 *
 * @param requirement The maximum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxValue<
  TInput extends string | number | bigint | Date,
  const TRequirement extends TInput
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = 'max_value' as const;
  const message = error ?? 'Invalid value';
  return assign(
    (input: TInput): PipeResult<TInput> =>
      input > requirement
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}

/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
export const maxRange = maxValue;

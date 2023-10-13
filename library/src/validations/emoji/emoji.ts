import type { ErrorMessage, PipeResult } from '../../types.ts';
import { assign, getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: ErrorMessage) {
  const kind = 'emoji' as const;
  const requirement = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
  const message = error ?? 'Invalid emoji';
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

import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { assign, getSchemaIssues } from '../../utils/index.ts';

/**
 * Never schema async type.
 */
export type NeverSchemaAsync = BaseSchemaAsync<never> & {
  kind: 'never';
};

/**
 * Creates an async never schema.
 *
 * @param error The error message.
 *
 * @returns An async never schema.
 */
export function neverAsync(error?: ErrorMessage): NeverSchemaAsync {
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      return getSchemaIssues(
        info,
        'type',
        'never',
        error || 'Invalid type',
        input
      );
    },
    {
      kind: 'never',
      async: true,
    } as const
  );
}

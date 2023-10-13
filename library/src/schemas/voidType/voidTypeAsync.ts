import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  kind: 'void';
};

/**
 * Creates an async void schema.
 *
 * @param error The error message.
 *
 * @returns An async void schema.
 */
export function voidTypeAsync(error?: ErrorMessage): VoidSchemaAsync {
  return Object.assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      if (typeof input !== 'undefined') {
        return getSchemaIssues(
          info,
          'type',
          'void',
          error || 'Invalid type',
          input
        );
      }

      return getOutput(input);
    },
    {
      kind: 'void',
      async: true,
    } as const
  );
}

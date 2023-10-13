import type {
  BaseSchemaAsync,
  ErrorMessage,
  ParseInfoAsync,
} from '../../types.ts';
import { getSchemaIssues, getOutput, assign } from '../../utils/index.ts';
import type { Enum } from './types.ts';

/**
 * Enum schema async type.
 */
export type EnumSchemaAsync<
  TEnum extends Enum,
  TOutput = TEnum[number]
> = BaseSchemaAsync<TEnum[number], TOutput> & {
  kind: 'enum';
  /**
   * The enum value.
   */
  enum: TEnum;
};

/**
 * Creates an async enum schema.
 *
 * @param enumValue The enum value.
 * @param error The error message.
 *
 * @returns An async enum schema.
 */
export function enumTypeAsync<
  TOption extends string,
  TEnum extends Enum<TOption>
>(enumValue: TEnum, error?: ErrorMessage): EnumSchemaAsync<TEnum> {
  return assign(
    async (input: unknown, info?: ParseInfoAsync) => {
      // Check type of input
      if (!enumValue.includes(input as any)) {
        return getSchemaIssues(
          info,
          'type',
          'enum',
          error || 'Invalid type',
          input
        );
      }

      // Return inpot as output
      return getOutput(input as TEnum[number]);
    },
    {
      kind: 'enum',
      async: true,
      enum: enumValue,
    } as const
  );
}

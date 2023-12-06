import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { Enum } from './enum.ts';

/**
 * Native enum schema async type.
 */
export class EnumSchemaAsync<
  TEnum extends Enum,
  TOutput = TEnum[keyof TEnum]
> extends BaseSchemaAsync<TEnum[keyof TEnum], TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'enum';
  /**
   * The enum value.
   */
  enum: TEnum;
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(enum_: TEnum, message: ErrorMessage = 'Invalid type') {
    super();
    this.enum = enum_;
    this.message = message;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!Object.values(this.enum).includes(input as any)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async enum schema.
 *
 * @param enum_ The enum value.
 * @param message The error message.
 *
 * @returns An async enum schema.
 */
export const enumAsync = <TEnum extends Enum>(
  enum_: TEnum,
  message?: ErrorMessage
) => new EnumSchemaAsync(enum_, message);

/**
 * See {@link enumAsync}
 *
 * @deprecated Use `enumAsync` instead.
 */
export const nativeEnumAsync = enumAsync;

import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Enum type.
 */
export type Enum = {
  [key: string]: string | number;
  [key: number]: string;
};

/**
 * Native enum schema type.
 */
export class EnumSchema<
  TEnum extends Enum,
  TOutput = TEnum[keyof TEnum]
> extends BaseSchema<TEnum[keyof TEnum], TOutput> {
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

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!Object.values(this.enum).includes(input as any)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Return parse result
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a enum schema.
 *
 * @param enum_ The enum value.
 * @param message The error message.
 *
 * @returns A enum schema.
 */
export const enum_ = (enum_: Enum, message?: ErrorMessage) =>
  new EnumSchema(enum_, message);

/**
 * See {@link enum_}
 *
 * @deprecated Use `enum_` instead.
 */
export const nativeEnum = enum_;

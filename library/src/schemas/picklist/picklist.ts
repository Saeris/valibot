import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { PicklistOptions } from './types.ts';

/**
 * Picklist schema type.
 */
export class PicklistSchema<
  TOptions extends PicklistOptions,
  TOutput = TOptions[number]
> extends BaseSchema<TOptions[number], TOutput> {
  /**
   * The picklist options.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(options: TOptions, message: ErrorMessage = 'Invalid type') {
    super();
    this.options = options;
    this.message = message;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!this.options.includes(input as any)) {
      return schemaIssue(info, 'type', 'picklist', this.message, input);
    }

    // Return inpot as output
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 * @param message The error message.
 *
 * @returns A picklist schema.
 */
export const picklist = <
  TOption extends string,
  TOptions extends PicklistOptions<TOption>
>(
  options: TOptions,
  message?: ErrorMessage
) => new PicklistSchema(options, message);

/**
 * See {@link picklist}
 *
 * @deprecated Use `picklist` instead.
 */
export const enumType = picklist;

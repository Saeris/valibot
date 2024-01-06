import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { PicklistOptions } from './types.ts';

/**
 * Picklist schema async type.
 */
export class PicklistSchemaAsync<
  TOptions extends PicklistOptions,
  TOutput = TOptions[number]
> extends BaseSchemaAsync<TOptions[number], TOutput> {
  /**
   * The picklist value.
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!this.options.includes(input as any)) {
      return schemaIssue(info, 'type', 'picklist', this.message, input);
    }

    // Return inpot as output
    return parseResult(true, input as TOutput);
  }
}

/**
 * Creates an async picklist schema.
 *
 * @param options The picklist options.
 * @param message The error message.
 *
 * @returns An async picklist schema.
 */
export const picklistAsync = <
  TOption extends string,
  TOptions extends PicklistOptions<TOption>
>(
  options: TOptions,
  message?: ErrorMessage
) => new PicklistSchemaAsync(options, message);

/**
 * See {@link picklistAsync}
 *
 * @deprecated Use `picklistAsync` instead.
 */
export const enumTypeAsync = picklistAsync;

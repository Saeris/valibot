import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Issues,
  type Output,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { ObjectSchema } from '../object/index.ts';

/**
 * Variant option type.
 */
export type VariantOption<TKey extends string> =
  | ObjectSchema<Record<TKey, BaseSchema>, any>
  | (BaseSchema & {
      type: 'variant';
      options: VariantOptions<TKey>;
    });

/**
 * Variant options type.
 */
export type VariantOptions<TKey extends string> = [
  VariantOption<TKey>,
  VariantOption<TKey>,
  ...VariantOption<TKey>[]
];

/**
 * Variant schema type.
 */
export class VariantSchema<
  const TKey extends string,
  const TOptions extends VariantOptions<TKey>,
  const TOutput = Output<TOptions[number]>
> extends BaseSchema<Input<TOptions[number]>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'variant';
  /**
   * The discriminator key.
   */
  key: TKey;
  /**
   * The variant options.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;

  constructor(
    key: TKey,
    options: TOptions,
    message: ErrorMessage = 'Invalid type'
  ) {
    super();
    this.key = key;
    this.options = options;
    this.message = message;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!input || typeof input !== 'object' || !(this.key in input)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create issues and output
    let issues: Issues | undefined;
    let output: [Record<string, any>] | undefined;

    // Create function to parse options recursively
    const parseOptions = (options: VariantOptions<TKey>) => {
      for (const schema of options) {
        // If it is an object schema, parse discriminator key
        if (schema.type === 'object') {
          const keyResult = schema.entries[this.key]._parse(
            (input as Record<TKey, unknown>)[this.key],
            info
          );

          // If right variant option was found, parse it
          if (!keyResult.issues) {
            const dataResult = schema._parse(input, info);

            // If there are issues, capture them
            if (dataResult.issues) {
              issues = dataResult.issues;

              // Otherwise, set output
            } else {
              // Note: Output is nested in array, so that also a falsy value
              // further down can be recognized as valid value
              output = [dataResult.output!];
            }

            // Break loop to end execution
            break;
          }

          // Otherwise, if it is a variant parse its options
          // recursively
        } else if (schema.type === 'variant') {
          parseOptions(schema.options);

          // If variant option was found, break loop to end execution
          if (issues || output) {
            break;
          }
        }
      }
    };

    // Parse options recursively
    parseOptions(this.options);

    // If there is an output, return typed parse result
    if (output) {
      return parseResult(true, output[0] as TOutput);
    }

    // If there are issues, return untyped parse result
    if (issues) {
      return parseResult(false, output as TOutput, issues);
    }

    // If discriminator key is invalid, return issue
    return schemaIssue(info, 'type', this.type, this.message, input);
  }
}

/**
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns A variant schema.
 */
export const variant = <
  const TKey extends string,
  const TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  message?: ErrorMessage
) => new VariantSchema(key, options, message);

/**
 * See {@link variant}
 *
 * @deprecated Use `variant` instead.
 */
export const discriminatedUnion = variant;

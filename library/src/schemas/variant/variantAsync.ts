import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Input,
  type Issues,
  type Output,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { ObjectSchema, ObjectSchemaAsync } from '../object/index.ts';

/**
 * Variant option async type.
 */
export type VariantOptionAsync<TKey extends string> =
  | ObjectSchema<Record<TKey, BaseSchema>, any>
  | ObjectSchemaAsync<Record<TKey, BaseSchema | BaseSchemaAsync>, any>
  | ((BaseSchema | BaseSchemaAsync) & {
      type: 'variant';
      options: VariantOptionsAsync<TKey>;
    });

/**
 * Variant options async type.
 */
export type VariantOptionsAsync<TKey extends string> = [
  VariantOptionAsync<TKey>,
  VariantOptionAsync<TKey>,
  ...VariantOptionAsync<TKey>[]
];

/**
 * Variant schema async type.
 */
export class VariantSchemaAsync<
  const TKey extends string,
  const TOptions extends VariantOptionsAsync<TKey>,
  TOutput = Output<TOptions[number]>
> extends BaseSchemaAsync<Input<TOptions[number]>, TOutput> {
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

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!input || typeof input !== 'object' || !(this.key in input)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Create issues and output
    let issues: Issues | undefined;
    let output: [Record<string, any>] | undefined;

    // Create function to parse options recursively
    const parseOptions = async (options: VariantOptionsAsync<TKey>) => {
      for (const schema of options) {
        // If it is an object schema, parse discriminator key
        if (schema.type === 'object') {
          const keyResult = await schema.entries[this.key]._parse(
            (input as Record<TKey, unknown>)[this.key],
            info
          );

          // If right variant option was found, parse it
          if (!keyResult.issues) {
            const dataResult = await schema._parse(input, info);

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
          await parseOptions(schema.options);

          // If variant option was found, break loop to end execution
          if (issues || output) {
            break;
          }
        }
      }
    };

    // Parse options recursively
    await parseOptions(this.options);

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
 * Creates an async variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns An async variant schema.
 */
export const variantAsync = <
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>
>(
  key: TKey,
  options: TOptions,
  message?: ErrorMessage
) => new VariantSchemaAsync(key, options, message);

/**
 * See {@link variantAsync}
 *
 * @deprecated Use `variantAsync` instead.
 */
export const discriminatedUnionAsync = variantAsync;

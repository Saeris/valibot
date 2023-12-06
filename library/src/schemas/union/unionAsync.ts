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

/**
 * Union options async type.
 */
export type UnionOptionsAsync = [
  BaseSchema | BaseSchemaAsync,
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Union schema async type.
 */
export class UnionSchemaAsync<
  const TOptions extends UnionOptionsAsync,
  TOutput = Output<TOptions[number]>
> extends BaseSchemaAsync<Input<TOptions[number]>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'union';
  /**
   * The union options.
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
    // Create issues and output
    let issues: Issues | undefined;
    let output: [Output<TOptions[number]>] | undefined;

    // Parse schema of each option
    for (const schema of this.options) {
      const result = await schema._parse(input, info);

      // If there are issues, capture them
      if (result.issues) {
        if (issues) {
          for (const issue of result.issues) {
            issues.push(issue);
          }
        } else {
          issues = result.issues;
        }

        // Otherwise, set output and break loop
      } else {
        // Note: Output is nested in array, so that also a falsy value
        // further down can be recognized as valid value
        output = [result.output];
        break;
      }
    }

    // If there is an output, return parse result
    if (output) {
      return parseResult(true, output[0]);
    }

    // Otherwise, return schema issue
    return schemaIssue(info, 'type', this.type, this.message, input, issues);
  }
}

/**
 * Creates an async union schema.
 *
 * @param options The union options.
 * @param message The error message.
 *
 * @returns An async union schema.
 */
export const unionAsync = <TOptions extends UnionOptionsAsync>(
  options: TOptions,
  message?: ErrorMessage
) => new UnionSchemaAsync(options, message);

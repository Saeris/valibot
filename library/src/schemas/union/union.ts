import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
  ParseInfo,
} from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Union options type.
 */
export type UnionOptions = [
  BaseSchema<any>,
  BaseSchema<any>,
  ...BaseSchema<any>[]
];

/**
 * Union schema type.
 */
export type UnionSchema<
  TUnionOptions extends UnionOptions,
  TOutput = Output<TUnionOptions[number]>
> = BaseSchema<Input<TUnionOptions[number]>, TOutput> & {
  kind: 'union';
  /**
   * The union schema.
   */
  union: TUnionOptions;
};

/**
 * Creates a union schema.
 *
 * @param union The union schema.
 * @param error The error message.
 *
 * @returns A union schema.
 */
export function union<TUnionOptions extends UnionOptions>(
  union: TUnionOptions,
  error?: ErrorMessage
): UnionSchema<TUnionOptions> {
  return Object.assign(
    (input: unknown, info?: ParseInfo) => {
      // Create issues and output
      let issues: Issues | undefined;
      let output: [Output<TUnionOptions[number]>] | undefined;

      // Parse schema of each option
      for (const schema of union) {
        const result = schema(input, info);

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

      // Return output or issues
      return output
        ? getOutput(output[0])
        : getSchemaIssues(
            info,
            'type',
            'union',
            error || 'Invalid type',
            input,
            issues
          );
    },
    {
      kind: 'union',
      async: false,
      union,
    } as const
  );
}

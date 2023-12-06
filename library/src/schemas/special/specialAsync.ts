import {
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * Special schema async type.
 */
export class SpecialSchemaAsync<
  const TInput,
  const TOutput = TInput
> extends BaseSchemaAsync<TInput, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'special';
  /**
   * The type check function.
   */
  check: (input: unknown) => boolean | Promise<boolean>;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  constructor(
    check: (input: unknown) => boolean | Promise<boolean>,
    arg2?: PipeAsync<TOutput> | ErrorMessage,
    arg3?: PipeAsync<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);
    this.check = check;
    this.message = message;
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(await this.check(input))) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

export interface SpecialSchemaAsyncFactory {
  /**
   * Creates an async special schema.
   *
   * @param check The type check function.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async special schema.
   */
  <const TInput>(
    check: (input: unknown) => boolean | Promise<boolean>,
    pipe?: PipeAsync<TInput>
  ): SpecialSchemaAsync<TInput>;

  /**
   * Creates a special schema.
   *
   * @param check The type check function.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A special schema.
   */
  <const TInput>(
    check: (input: unknown) => boolean | Promise<boolean>,
    message?: ErrorMessage,
    pipe?: PipeAsync<TInput>
  ): SpecialSchemaAsync<TInput>;
}

export const specialAsync: SpecialSchemaAsyncFactory = <const TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  arg2?: PipeAsync<TInput> | ErrorMessage,
  arg3?: PipeAsync<TInput>
) => new SpecialSchemaAsync(check, arg2, arg3);

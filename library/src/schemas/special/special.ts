import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Special schema type.
 */
export class SpecialSchema<TInput, TOutput = TInput> extends BaseSchema<
  TInput,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'special';
  /**
   * The type check function.
   */
  check: (input: unknown) => boolean;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<TOutput> | undefined;

  constructor(
    check: (input: unknown) => boolean,
    arg2?: Pipe<TOutput> | ErrorMessage,
    arg3?: Pipe<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);
    this.check = check;
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!this.check(input)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, this.type);
  }
}

export interface SpecialSchemaFactory {
  /**
   * Creates a special schema.
   *
   * @param check The type check function.
   * @param pipe A validation and transformation pipe.
   *
   * @returns A special schema.
   */
  <const TInput>(
    check: (input: unknown) => boolean,
    pipe?: Pipe<TInput>
  ): SpecialSchema<TInput>;

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
    check: (input: unknown) => boolean,
    message?: ErrorMessage,
    pipe?: Pipe<TInput>
  ): SpecialSchema<TInput>;
}

export const special: SpecialSchemaFactory = <TInput>(
  check: (input: unknown) => boolean,
  arg2?: Pipe<TInput> | ErrorMessage,
  arg3?: Pipe<TInput>
) => new SpecialSchema(check, arg2, arg3);

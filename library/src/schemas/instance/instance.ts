import {
  BaseSchema,
  type ParseInfo,
  type ErrorMessage,
  type Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Class enum type.
 */
export type Class = abstract new (...args: any) => any;

/**
 * Instance schema type.
 */
export class InstanceSchema<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> extends BaseSchema<InstanceType<TClass>, TOutput> {
  /**
   * The class of the instance.
   */
  class: TClass;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: Pipe<TOutput>;

  constructor(
    class_: TClass,
    arg2?: Pipe<TOutput> | ErrorMessage,
    arg3?: Pipe<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);
    this.class = class_;
    this.message = message;
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(input instanceof this.class)) {
      return schemaIssue(info, 'type', 'instance', this.message, input);
    }

    // Execute pipe and return result
    return pipeResult(input as TOutput, this.pipe, info, 'instance');
  }
}

export interface InstanceSchemaFactory {
  /**
   * Creates an instance schema.
   *
   * @param class_ The class of the instance.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An instance schema.
   */
  <TClass extends Class>(
    class_: TClass,
    pipe?: Pipe<InstanceType<TClass>>
  ): InstanceSchema<TClass>;

  /**
   * Creates an instance schema.
   *
   * @param class_ The class of the instance.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An instance schema.
   */
  <TClass extends Class>(
    class_: TClass,
    message?: ErrorMessage,
    pipe?: Pipe<InstanceType<TClass>>
  ): InstanceSchema<TClass>;
}

export const instance: InstanceSchemaFactory = <
  TClass extends Class,
  TOutput = InstanceType<TClass>
>(
  class_: TClass,
  arg2?: Pipe<TOutput> | ErrorMessage,
  arg3?: Pipe<TOutput>
) => new InstanceSchema(class_, arg2, arg3);

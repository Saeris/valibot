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
import { type Class } from './instance.ts';

/**
 * Instance schema type.
 */
export class InstanceSchemaAsync<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> extends BaseSchemaAsync<InstanceType<TClass>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'instance';
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
  pipe?: PipeAsync<TOutput>;

  constructor(
    class_: TClass,
    arg2?: PipeAsync<TOutput> | ErrorMessage,
    arg3?: PipeAsync<TOutput>
  ) {
    super();
    // Get message and pipe argument
    const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);
    this.class = class_;
    this.message = message;
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!(input instanceof this.class)) {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Execute pipe and return result
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

export interface InstanceSchemaAsyncFactory {
  /**
   * Creates an async instance schema.
   *
   * @param class_ The class of the instance.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async instance schema.
   */
  <TClass extends Class>(
    class_: TClass,
    pipe?: PipeAsync<InstanceType<TClass>>
  ): InstanceSchemaAsync<TClass>;

  /**
   * Creates an async instance schema.
   *
   * @param class_ The class of the instance.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async instance schema.
   */
  <TClass extends Class>(
    class_: TClass,
    message?: ErrorMessage,
    pipe?: PipeAsync<InstanceType<TClass>>
  ): InstanceSchemaAsync<TClass>;
}

export const instanceAsync: InstanceSchemaAsyncFactory = <
  TClass extends Class,
  TOutput = InstanceType<TClass>
>(
  class_: TClass,
  arg2?: PipeAsync<TOutput> | ErrorMessage,
  arg3?: PipeAsync<TOutput>
) => new InstanceSchemaAsync(class_, arg2, arg3);

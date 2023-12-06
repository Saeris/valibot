import { BaseSchema, type ParseInfo, type Pipe } from '../../types/index.ts';
import { pipeResult } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export class UnknownSchema<const TOutput = unknown> extends BaseSchema<
  unknown,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'unknown';
  /**
   * The validation and transformation pipeline.
   */
  pipe?: Pipe<TOutput>;

  constructor(pipe?: Pipe<TOutput>) {
    super();
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    return pipeResult(input as TOutput, this.pipe, info, this.type);
  }
}

/**
 * Creates a unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
export const unknown = (pipe?: Pipe<unknown>) => new UnknownSchema(pipe);

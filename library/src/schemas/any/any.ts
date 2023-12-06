import { BaseSchema, type ParseInfo, type Pipe } from '../../types/index.ts';
import { pipeResult } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export class AnySchema<const TOutput = any> extends BaseSchema<any, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe?: Pipe<any>;

  constructor(pipe?: Pipe<any>) {
    super();
    this.pipe = pipe;
  }

  _parse(input: unknown, info?: ParseInfo) {
    return pipeResult(input, this.pipe, info, this.type);
  }
}

/**
 * Creates a any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A any schema.
 */
export const any = (pipe?: Pipe<any>) => new AnySchema(pipe);

import {
  BaseSchemaAsync,
  type PipeAsync,
  type ParseInfo,
} from '../../types/index.ts';
import { pipeResultAsync } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export class AnySchemaAsync<TOutput = any> extends BaseSchemaAsync<
  any,
  TOutput
> {
  /**
   * The schema type.
   */
  readonly type = 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<any>;

  constructor(pipe?: PipeAsync<any>) {
    super();
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    return pipeResultAsync(input, this.pipe, info, this.type);
  }
}

/**
 * Creates an async any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async any schema.
 */
export const anyAsync = (pipe?: PipeAsync<any>) => new AnySchemaAsync(pipe);

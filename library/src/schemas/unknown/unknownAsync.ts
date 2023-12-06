import {
  BaseSchemaAsync,
  type ParseInfo,
  type PipeAsync,
} from '../../types/index.ts';
import { pipeResultAsync } from '../../utils/index.ts';

/**
 * Unknown schema async type.
 */
export class UnknownSchemaAsync<
  const TOutput = unknown
> extends BaseSchemaAsync<unknown, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'unknown';
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  constructor(pipe?: PipeAsync<TOutput>) {
    super();
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    return pipeResultAsync(input as TOutput, this.pipe, info, this.type);
  }
}

/**
 * Creates an async unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
export const unknownAsync = (pipe?: PipeAsync<unknown>) =>
  new UnknownSchemaAsync(pipe);

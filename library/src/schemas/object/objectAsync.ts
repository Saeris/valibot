import {
  type BaseSchema,
  BaseSchemaAsync,
  type ParseInfo,
  type ErrorMessage,
  type Issues,
  type PipeAsync,
} from '../../types/index.ts';
import {
  pipeResultAsync,
  restAndDefaultArgs,
  schemaIssue,
  parseResult,
} from '../../utils/index.ts';
import type { ObjectInput, ObjectOutput, ObjectPathItem } from './types.ts';

/**
 * Object entries async type.
 */
export type ObjectEntriesAsync = Record<string, BaseSchema | BaseSchemaAsync>;

/**
 * Object schema async type.
 */
export class ObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  TOutput = ObjectOutput<TEntries, TRest>
> extends BaseSchemaAsync<ObjectInput<TEntries, TRest>, TOutput> {
  /**
   * The schema type.
   */
  readonly type = 'object';
  /**
   * The object entries schema.
   */
  entries: TEntries;
  /**
   * The object rest schema.
   */
  rest: TRest;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe?: PipeAsync<TOutput>;

  // Create cached entries
  #cachedEntries?: [string, BaseSchema | BaseSchemaAsync][];

  constructor(
    entries: TEntries,
    arg2?: PipeAsync<TOutput> | ErrorMessage | TRest,
    arg3?: PipeAsync<TOutput> | ErrorMessage,
    arg4?: PipeAsync<TOutput>
  ) {
    super();
    // Get rest, message and pipe argument
    const [rest, message = 'Invalid type', pipe] = restAndDefaultArgs<
      TRest,
      PipeAsync<TOutput>
    >(arg2, arg3, arg4);
    this.entries = entries;
    this.rest = rest;
    this.message = message;
    this.pipe = pipe;
  }

  async _parse(input: unknown, info?: ParseInfo) {
    // Check type of input
    if (!input || typeof input !== 'object') {
      return schemaIssue(info, 'type', this.type, this.message, input);
    }

    // Cache object entries lazy
    this.#cachedEntries = this.#cachedEntries || Object.entries(this.entries);

    // Create typed, issues and output
    let typed = true;
    let issues: Issues | undefined;
    const output: Record<string, any> = {};

    // Parse schema of each key
    await Promise.all([
      Promise.all(
        this.#cachedEntries.map(async ([key, schema]) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            // Get value by key
            const value = (input as Record<string, unknown>)[key];

            // Get parse result of value
            const result = await schema._parse(value, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                // Create object path item
                const pathItem: ObjectPathItem = {
                  type: 'object',
                  input: input as Record<string, unknown>,
                  key,
                  value,
                };

                // Add modified result issues to issues
                for (const issue of result.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  issues?.push(issue);
                }
                if (!issues) {
                  issues = result.issues;
                }

                // If necessary, abort early
                if (info?.abortEarly) {
                  typed = false;
                  throw null;
                }
              }

              // If not typed, set typed to false
              if (!result.typed) {
                typed = false;
              }

              // Set output of entry if necessary
              if (result.output !== undefined || key in input) {
                output[key] = result.output;
              }
            }
          }
        })
      ),

      this.rest &&
        Promise.all(
          Object.entries(input).map(async ([key, value]) => {
            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              if (!(key in this.entries)) {
                // Get parse result of value
                const result = await this.rest!._parse(value, info);

                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    // Create object path item
                    const pathItem: ObjectPathItem = {
                      type: 'object',
                      input: input as Record<string, unknown>,
                      key,
                      value,
                    };

                    // Add modified result issues to issues
                    for (const issue of result.issues) {
                      if (issue.path) {
                        issue.path.unshift(pathItem);
                      } else {
                        issue.path = [pathItem];
                      }
                      issues?.push(issue);
                    }
                    if (!issues) {
                      issues = result.issues;
                    }

                    // If necessary, abort early
                    if (info?.abortEarly) {
                      typed = false;
                      throw null;
                    }
                  }

                  // If not typed, set typed to false
                  if (!result.typed) {
                    typed = false;
                  }

                  // Set output of entry
                  output[key] = result.output;
                }
              }
            }
          })
        ),
    ]).catch(() => null);

    // If output is typed, execute pipe
    if (typed) {
      return pipeResultAsync(
        output as TOutput,
        this.pipe,
        info,
        this.type,
        issues
      );
    }

    // Otherwise, return untyped parse result
    return parseResult(false, output, issues as Issues);
  }
}

export interface ObjectSchemaAsyncFactory {
  /**
   * Creates an async object schema.
   *
   * @param entries The object entries.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async object schema.
   */
  <TEntries extends ObjectEntriesAsync>(
    entries: TEntries,
    pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>
  ): ObjectSchemaAsync<TEntries>;

  /**
   * Creates an async object schema.
   *
   * @param entries The object entries.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async object schema.
   */
  <TEntries extends ObjectEntriesAsync>(
    entries: TEntries,
    message?: ErrorMessage,
    pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>
  ): ObjectSchemaAsync<TEntries>;

  /**
   * Creates an async object schema.
   *
   * @param entries The object entries.
   * @param rest The object rest.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async object schema.
   */
  <
    TEntries extends ObjectEntriesAsync,
    TRest extends BaseSchema | BaseSchemaAsync | undefined
  >(
    entries: TEntries,
    rest: TRest,
    pipe?: PipeAsync<ObjectOutput<TEntries, TRest>>
  ): ObjectSchemaAsync<TEntries, TRest>;

  /**
   * Creates an async object schema.
   *
   * @param entries The object entries.
   * @param rest The object rest.
   * @param message The error message.
   * @param pipe A validation and transformation pipe.
   *
   * @returns An async object schema.
   */
  <
    TEntries extends ObjectEntriesAsync,
    TRest extends BaseSchema | BaseSchemaAsync | undefined
  >(
    entries: TEntries,
    rest: TRest,
    message?: ErrorMessage,
    pipe?: PipeAsync<ObjectOutput<TEntries, TRest>>
  ): ObjectSchemaAsync<TEntries, TRest>;
}

export const objectAsync: ObjectSchemaAsyncFactory = <
  TEntries extends ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  entries: TEntries,
  arg2?: PipeAsync<ObjectOutput<TEntries, TRest>> | ErrorMessage | TRest,
  arg3?: PipeAsync<ObjectOutput<TEntries, TRest>> | ErrorMessage,
  arg4?: PipeAsync<ObjectOutput<TEntries, TRest>>
) => new ObjectSchemaAsync(entries, arg2, arg3, arg4);

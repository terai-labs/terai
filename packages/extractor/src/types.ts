import type { Opts, MessageDescriptor } from '@rosseta/transformer'
import type { Formatter } from './formatters'

export interface ExtractionResult<M = Record<string, string>> {
  /**
   * List of extracted messages
   */
  messages: MessageDescriptor[]
  /**
   * Metadata extracted w/ `pragma`
   */
  meta?: M
}

export interface ExtractedMessageDescriptor extends MessageDescriptor {
  /**
   * Line number
   */
  line?: number
  /**
   * Column number
   */
  col?: number
  /**
   * Metadata extracted from pragma
   */
  meta?: Record<string, string>
}

export type ExtractCLIOptions = Omit<
  ExtractOpts,
  'overrideIdFn' | 'onMsgExtracted' | 'onMetaExtracted'
> & {
  /**
   * Output File
   */
  outFile?: string
  /**
   * Ignore file glob pattern
   */
  ignore?: string[]
}

export type ExtractOpts = Opts & {
  /**
   * Whether to throw an error if we had any issues with
   * 1 of the source files
   */
  throws?: boolean
  /**
   * Message ID interpolation pattern
   */
  idInterpolationPattern?: string
  /**
   * Path to a formatter file that controls the shape of JSON file from `outFile`.
   */
  format?: string | Formatter
  /**
   * Whether to hoist selectors & flatten sentences
   */
  flatten?: boolean
} & Pick<Opts, 'onMsgExtracted' | 'onMetaExtracted'>

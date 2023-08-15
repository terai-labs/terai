import type { ExtractedMessage } from '@rosseta/types'
import type { Opts } from '@rosseta/transformer'

export interface ExtractionResult<M = Record<string, string>> {
  /**
   * List of extracted messages
   */
  messages: ExtractedMessage[]
  /**
   * Metadata extracted w/ `pragma`
   */
  meta?: M
}

export interface ExtractedMessageDescriptor extends ExtractedMessage {
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
  'onMsgExtracted' | 'onMetaExtracted'
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
   * Whether to hoist selectors & flatten sentences
   */
  flatten?: boolean
} & Pick<Opts, 'onMsgExtracted' | 'onMetaExtracted'>

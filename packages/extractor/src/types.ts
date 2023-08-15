import type { Opts } from '@rosseta/transformer'

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

export type ExtractOpts = Opts & {} & Pick<
    Opts,
    'onMsgExtracted' | 'onMetaExtracted'
  >

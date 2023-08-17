// Dependencies
import * as ts from 'typescript'
import { transform } from '@rosseta/transformer'

// Types
import type { Opts } from '@rosseta/transformer'
import type { ExtractedMessage } from '@rosseta/types'

export async function processFile(
  source: string,
  fileName: string,
  options: Opts = {}
): Promise<ExtractedMessage[]> {
  let messages: ExtractedMessage[] = []

  ts.transpileModule(source, {
    reportDiagnostics: true,
    fileName,
    compilerOptions: {
      allowJs: true,
      target: ts.ScriptTarget.ESNext,
      noEmit: true,
      experimentalDecorators: true
    },
    transformers: {
      before: [
        transform({
          ...options,
          onMsgExtracted: (_, msgs) => {
            messages = messages.concat(msgs)
          }
          // additionalComponentNames: [
          //   '$formatMessage',
          //   ...(options.additionalComponentNames || [])
          // ],
        })
      ]
    }
  })

  return messages
}

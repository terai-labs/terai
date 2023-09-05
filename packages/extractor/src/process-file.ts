// Dependencies
import * as ts from 'typescript'
import { transform } from '@rewordlabs/transformer'

// Types
import type { TransformerOptions } from '@rewordlabs/transformer'
import type { ExtractedMessage } from '@rewordlabs/types'

export async function processFile(
  source: string,
  fileName: string,
  options: TransformerOptions = {}
): Promise<ExtractedMessage[]> {
  let extractedMessages: ExtractedMessage[] = []

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
            extractedMessages = extractedMessages.concat(msgs)
          }
        })
      ]
    }
  })

  return extractedMessages
}

// Dependencies
import * as ts from 'typescript'
import { transform } from '@rosetta.js/transformer'

// Types
import type { TransformerOptions } from '@rosetta.js/transformer'
import type { ExtractedMessage } from '@rosetta.js/types'

export async function processFile(
  source: string,
  fileName: string,
  options: TransformerOptions = {}
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
        })
      ]
    }
  })

  return messages
}

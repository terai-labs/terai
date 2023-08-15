// Dependencies
import { transform } from '@rosseta/transformer'
import * as ts from 'typescript'

// Types
import type { ExtractedMessageDescriptor } from './types'
import type { Opts } from '@rosseta/transformer'

export async function processFile(
  source: string,
  fileName: string,
  options: Opts
) {
  let messages: ExtractedMessageDescriptor[] = []
  let meta: Record<string, string> | undefined

  try {
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
            onMetaExtracted: (_, m) => (meta = m),
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
  } catch (e) {
    if (e instanceof Error) {
      e.message = `Error processing file ${fileName} ${e.message || ''}`
    }

    throw e
  }

  if (meta) {
    messages.forEach(m => (m.meta = meta))
  }

  return { messages, meta }
}

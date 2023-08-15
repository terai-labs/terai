// Dependencies
import { transform } from '@rosseta/transformer'
import * as ts from 'typescript'

// Types
import type { ExtractedMessageDescriptor } from './types'
import type { Opts } from '@rosseta/transformer'

function calculateLineColFromOffset(
  text: string,
  start?: number
): Pick<ExtractedMessageDescriptor, 'line' | 'col'> {
  if (!start) {
    return { line: 1, col: 1 }
  }
  const chunk = text.slice(0, start)
  const lines = chunk.split('\n')
  const lastLine = lines[lines.length - 1]
  return { line: lines.length, col: lastLine.length }
}

export async function processFile(
  source: string,
  fileName: string,
  {
    idInterpolationPattern,
    ...opts
  }: Opts & { idInterpolationPattern?: string }
) {
  let messages: ExtractedMessageDescriptor[] = []
  let meta: Record<string, string> | undefined

  opts = {
    ...opts,
    additionalComponentNames: [
      '$formatMessage',
      ...(opts.additionalComponentNames || [])
    ],
    onMsgExtracted(_, msgs) {
      if (opts.extractSourceLocation) {
        msgs = msgs.map(msg => ({
          ...msg,
          ...calculateLineColFromOffset(source, msg.start)
        }))
      }

      messages = messages.concat(msgs)
    },
    onMetaExtracted(_, m) {
      meta = m
    }
  }

  // console.log('Processing %s using typescript extractor', fileName)
  try {
    // console.log('Using TS compiler to process file', fileName)
    // output =
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
        before: [transform(opts)]
      }
    })
  } catch (e) {
    if (e instanceof Error) {
      e.message = `Error processing file ${fileName} ${e.message || ''}`
    }

    throw e
  }
  // console.log('Done extracting %s messages: %s', fileName, messages)

  if (meta) {
    // console.log('Extracted meta:', meta)
    messages.forEach(m => (m.meta = meta))
  }

  return { messages, meta }
}

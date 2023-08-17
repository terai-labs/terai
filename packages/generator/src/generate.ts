// Dependencies
import { runtime } from '@rosseta/node'
import { outdent } from 'outdent'

// Types
import type { Config, ExtractedMessage } from '@rosseta/types'

type GenerateOptions = {
  cwd: string
} & Pick<Config, 'outDir' | 'outExtension'>

export async function generate(
  messages: Map<string, ExtractedMessage>,
  { outExtension, cwd, outDir }: GenerateOptions
) {
  const isTs = outExtension === '.ts'
  const basePath = runtime.path.resolve(cwd, outDir, `es${outExtension}`)
  const messagesArray: { id: string; msg?: string }[] = []

  messages.forEach((msg, id) => {
    messagesArray.push({
      id,
      msg: msg.defaultMessage
    })
  })

  const content = getFileContent({
    messages: messagesArray,
    isTs
  })

  await runtime.fs.write(basePath, content)
}

function getFileContent({
  messages,
  isTs
}: {
  messages: { id: string; msg?: string }[]
  isTs: boolean
}) {
  return outdent`
    export default {
      ${messages.map(msg => `${msg.id}: '${msg.msg}'`).join(',\n  ')},
    }${isTs ? ' as const' : ''}
  `
}

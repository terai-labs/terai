// Dependencies
import { runtime } from '@rosetta.js/node'
import { outdent } from 'outdent'

// Types
import type { Config, ExtractedMessage } from '@rosetta.js/types'

type GenerateOptions = {
  cwd: string
} & Pick<Config, 'outDir' | 'outExtension' | 'baseLocale'>

export async function generate(
  messages: Map<string, ExtractedMessage>,
  { outExtension, cwd, outDir, baseLocale }: GenerateOptions
) {
  const isTs = outExtension === '.ts'
  const basePath = runtime.path.resolve(
    cwd,
    outDir,
    `${baseLocale}${outExtension}`
  )
  const messagesArray: { id: string; msg?: string }[] = []

  messages.forEach((msg, id) => {
    messagesArray.push({
      id,
      msg: msg.value
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
      ${messages.map(msg => `'${msg.id}': ${msg.msg}`).join(',\n  ')}
    }${isTs ? ' as const' : ''}
  `
}

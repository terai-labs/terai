// Dependencies
import { runtime } from '@rosetta.js/node'
import { translate } from '@rosetta.js/translator'
import { getContent } from './get-content'

// Types
import type { Config, ExtractedMessages, Messages } from '@rosetta.js/types'

type GenerateOptions = {
  cwd: string
} & Pick<Config, 'outDir' | 'outExtension' | 'projectLocale' | 'outLocales'>

export async function generate(
  extractedMessages: ExtractedMessages,
  { outExtension, cwd, outDir, projectLocale, outLocales }: GenerateOptions
) {
  const isTs = outExtension === '.ts'
  const messages: Messages = {}

  extractedMessages.forEach((msg, id) => {
    messages[id] = msg.value || ''
  })

  const translatedMessages = await translate(messages, {
    projectLocale,
    outLocales
  })

  const outputLocales = [projectLocale, ...outLocales]
  const output = [messages, ...translatedMessages]

  return Promise.all(
    output.map(async (messages, i) => {
      const basePath = runtime.path.resolve(
        cwd,
        outDir,
        `${outputLocales[i]}${outExtension}`
      )

      const content = getContent({
        messages,
        isTs
      })

      return runtime.fs.write(basePath, content)
    })
  )
}

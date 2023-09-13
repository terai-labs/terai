// Dependencies
import { runtime } from '@rewordlabs/runtime'
import { toPlainDictionary } from '@rewordlabs/utils'

// Types
import type { Config, Locale, ExtractedMessages } from '@rewordlabs/types'

type GenerateOptions = {
  cwd: string
  extractedMessages: ExtractedMessages
  locale: Locale
} & Pick<Config, 'outDir' | 'projectLocale'>

export async function generate({
  extractedMessages,
  locale,
  cwd,
  outDir
}: GenerateOptions) {
  const folderPath = runtime.path.resolve(cwd, outDir, locale)

  for (const id in extractedMessages) {
    const extractedMessagesChunk = extractedMessages[id]
    const dictionary = toPlainDictionary({ [id]: extractedMessagesChunk })

    runtime.fs.write(
      runtime.path.resolve(folderPath, id + '.json'),
      JSON.stringify(dictionary, null, 2)
    )
  }
}

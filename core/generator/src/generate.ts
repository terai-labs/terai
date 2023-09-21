// Dependencies
import { runtime } from '@rewordlabs/runtime'

// Types
import type { Config, Locale, Dictionary } from '@rewordlabs/types'

type GenerateOptions = {
  cwd: string
  locale: Locale
  dictionary: Dictionary
} & Pick<Config, 'outDir' | 'projectLocale'>

export async function generate({
  dictionary,
  locale,
  cwd,
  outDir
}: GenerateOptions) {
  const folderPath = runtime.path.resolve(cwd, outDir, locale)

  for (const id in dictionary) {
    const fileDir = runtime.path.resolve(folderPath, id + '.json')
    const isChunk = typeof dictionary[id] !== 'string'
    const fileContent = isChunk ? dictionary[id] : { [id]: dictionary[id] }

    runtime.fs.write(fileDir, JSON.stringify(fileContent, null, 2))
  }
}

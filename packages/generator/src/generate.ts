// Dependencies
import { runtime } from '@koi18n/runtime'

// Types
import type { Config, Locale, Dictionaries } from '@koi18n/types'

type GenerateOptions = {
  cwd: string
  locale: Locale
  dictionaries: Dictionaries
} & Pick<Config, 'outDir' | 'projectLocale'>

export async function generate({
  dictionaries,
  locale,
  cwd,
  outDir
}: GenerateOptions) {
  const folderPath = runtime.path.resolve(cwd, outDir, locale)

  for (const id in dictionaries) {
    const fileDir = runtime.path.resolve(folderPath, id + '.json')
    const fileContent = dictionaries[id]

    runtime.fs.write(fileDir, JSON.stringify(fileContent, null, 2))
  }
}

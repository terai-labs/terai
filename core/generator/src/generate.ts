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
    runtime.fs.write(
      runtime.path.resolve(folderPath, id + '.json'),
      JSON.stringify({ [id]: dictionary[id] }, null, 2)
    )
  }
}

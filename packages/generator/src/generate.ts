// Dependencies
import { runtime } from '@rosetta.js/node'
import { getContent } from './get-content'

// Types
import type { Config, Locale, Dictionary } from '@rosetta.js/types'

type GenerateOptions = {
  cwd: string
  dictionary: Dictionary
  locale: Locale
} & Pick<Config, 'outDir' | 'outExtension' | 'projectLocale' | 'outLocales'>

export async function generate({
  dictionary,
  outExtension,
  locale,
  cwd,
  outDir
}: GenerateOptions) {
  const isTs = outExtension === '.ts'
  const basePath = runtime.path.resolve(cwd, outDir, `${locale}${outExtension}`)

  const content = getContent({
    dictionary,
    isTs
  })

  return runtime.fs.write(basePath, content)
}

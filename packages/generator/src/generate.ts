// Dependencies
import { runtime } from '@rosetta.js/node'
import { getContent } from './get-content'

// Types
import type { Config, Locale, Messages } from '@rosetta.js/types'

type GenerateOptions = {
  cwd: string
  messages: Messages
  locale: Locale
} & Pick<Config, 'outDir' | 'outExtension' | 'projectLocale' | 'outLocales'>

export async function generate({
  messages,
  outExtension,
  locale,
  cwd,
  outDir
}: GenerateOptions) {
  const isTs = outExtension === '.ts'
  const basePath = runtime.path.resolve(cwd, outDir, `${locale}${outExtension}`)

  const content = getContent({
    messages,
    isTs
  })

  return runtime.fs.write(basePath, content)
}

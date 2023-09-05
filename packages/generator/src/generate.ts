// Dependencies
import { runtime } from '@rewordlabs/node'

// Types
import type { Config, Locale, Dictionary } from '@rewordlabs/types'

type GenerateOptions = {
  cwd: string
  dictionary: Dictionary
  locale: Locale
} & Pick<Config, 'outDir' | 'projectLocale' | 'locales'>

export async function generate({
  dictionary,
  locale,
  cwd,
  outDir
}: GenerateOptions) {
  const basePath = runtime.path.resolve(cwd, outDir, `${locale}.json`)

  return runtime.fs.write(basePath, JSON.stringify(dictionary, replacer, 2))
}

function replacer(key: unknown, value: unknown) {
  if (typeof value === 'string') {
    return value.slice(1, -1) // Remove the first and last character (single quotes)
  }
  return value
}

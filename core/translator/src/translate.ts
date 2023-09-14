// Dependencies
import { getAiTranslation } from './x'

// Types
import type { Config, Locale, Dictionary } from '@rewordlabs/types'

type TranslateOptions = Pick<Config, 'projectLocale' | 'openaiApiKey'> & {
  dictionary: Dictionary
  locale: Locale
}

export async function translate({
  dictionary,
  projectLocale,
  locale,
  openaiApiKey
}: TranslateOptions): Promise<Dictionary> {
  const messagesJson = JSON.stringify(dictionary)

  const translation = await getAiTranslation({
    messagesJson,
    locale,
    projectLocale,
    openaiApiKey
  })

  return JSON.parse(translation)
}

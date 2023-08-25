// Dependencies
import { getAiTranslation } from './x'

// Types
import type { Config, Locale, Messages } from '@rosetta.js/types'

type TranslateOptions = Pick<Config, 'projectLocale' | 'outLocales'> & {
  messages: Messages
  locale: Locale
}

export async function translate({
  messages,
  projectLocale,
  locale
}: TranslateOptions) {
  const messagesJson = JSON.stringify(messages)

  const translation = await getAiTranslation({
    messagesJson,
    locale,
    projectLocale
  })

  return JSON.parse(translation)
}

// Dependencies
import { getAiTranslation } from './x'

// Types
import type { Config, Locale, Messages } from '@rosetta.js/types'

type TranslateOptions = Pick<
  Config,
  'projectLocale' | 'outLocales' | 'openaiApiKey'
> & {
  messages: Messages
  locale: Locale
}

export async function translate({
  messages,
  projectLocale,
  locale,
  openaiApiKey
}: TranslateOptions) {
  const messagesJson = JSON.stringify(messages)

  const translation = await getAiTranslation({
    messagesJson,
    locale,
    projectLocale,
    openaiApiKey
  })

  return JSON.parse(translation)
}

// Dependencies
import { getAiTranslation } from './x'

// Types
import type { Config, Messages } from '@rosetta.js/types'

type TranslateOptions = Pick<Config, 'projectLocale' | 'outLocales'>

export async function translate(
  messages: Messages,
  { projectLocale, outLocales }: TranslateOptions
) {
  const messagesJson = JSON.stringify(messages)

  const translations = await Promise.all(
    outLocales.map(async locale => {
      const translation = await getAiTranslation({
        messagesJson,
        locale,
        projectLocale
      })

      return JSON.parse(translation)
    })
  )

  return translations
}

// Dependencies
import { v2 } from '@google-cloud/translate'

// Types
import type { Dictionary, Translator } from '@tsmu/types'

export const createGoogleCloudTranslator = (options: v2.TranslateConfig) => {
  const translate = new v2.Translate(options)

  const translator: Translator = async ({ dictionary, locale }) => {
    const translatedOutput: Dictionary = {}

    await Promise.all(
      Object.keys(dictionary).map(async key => {
        const value = dictionary[key]

        const [translation] = await translate.translate(value, locale)

        translatedOutput[key] = translation
      })
    )

    return translatedOutput
  }

  return translator
}

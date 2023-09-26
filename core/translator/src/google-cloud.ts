// Dependencies
import { v2 } from '@google-cloud/translate'

// Types
import type { Dictionary } from '@rewordlabs/types'
import type { TranslateOptions } from './translate'

export async function translateWithGoogleCloud({
  dictionary,
  locale,
  googleCloudCrendentials
}: Pick<
  TranslateOptions,
  'dictionary' | 'locale' | 'googleCloudCrendentials'
>) {
  const translate = new v2.Translate(googleCloudCrendentials)
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

// Dependencies
import { v2 } from '@google-cloud/translate'

// Types
import type {
  ConfigOptionsGoogleCloud,
  Dictionary,
  Locale
} from '@rewordlabs/types'

export async function translateWithGoogleCloud({
  dictionary,
  locale,
  googleCloudCrendentials
}: {
  dictionary: Dictionary
  locale: Locale
  googleCloudCrendentials: ConfigOptionsGoogleCloud['googleCloudCrendentials']
}) {
  const translate = new v2.Translate(googleCloudCrendentials)
  const translatedOutput: Record<string, string> = {}

  await Promise.all(
    Object.keys(dictionary).map(async key => {
      const [translation] = await translate.translate(dictionary[key], locale)
      translatedOutput[key] = translation
    })
  )

  return translatedOutput
}

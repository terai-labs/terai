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
  const translatedOutput: Dictionary = {}

  await Promise.all(
    Object.keys(dictionary).map(async dKey => {
      const valueOrChunk = dictionary[dKey]

      if (typeof valueOrChunk === 'string') {
        const value = valueOrChunk
        const [translation] = await translate.translate(value, locale)

        translatedOutput[dKey] = translation
      } else {
        const chunk = valueOrChunk
        const translatedChunk: Record<string, string> = {}

        await Promise.all(
          Object.keys(chunk).map(async cKey => {
            const [translation] = await translate.translate(chunk[cKey], locale)
            translatedChunk[cKey] = translation
          })
        )

        translatedOutput[dKey] = translatedChunk
      }
    })
  )

  return translatedOutput
}

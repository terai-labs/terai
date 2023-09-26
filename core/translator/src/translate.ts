// Dependencies
import { translateWithChatGpt } from './chat-gpt'
import { translateWithGoogleCloud } from './google-cloud'

// Types
import type { Config, Locale, Dictionary } from '@rewordlabs/types'

export type TranslateOptions = Pick<
  Config,
  | 'projectLocale'
  | 'translationService'
  | 'openaiApiKey'
  | 'googleCloudCrendentials'
> & {
  dictionary: Dictionary
  locale: Locale
}

export async function translate({
  dictionary,
  translationService,
  projectLocale,
  locale,
  openaiApiKey,
  googleCloudCrendentials
}: TranslateOptions): Promise<Dictionary> {
  if (translationService === 'OpenAI ChatGPT') {
    if (!openaiApiKey) {
      throw new Error('You need to provide your OpenAI API key')
    }

    return translateWithChatGpt({
      dictionary,
      locale,
      projectLocale,
      openaiApiKey
    })
  }

  if (translationService === 'Google Cloud') {
    if (!googleCloudCrendentials) {
      throw new Error('You need to provide your Google Cloud credentials')
    }

    return translateWithGoogleCloud({
      dictionary,
      locale,
      googleCloudCrendentials
    })
  }

  throw new Error(`You need to select a translation provider`)
}

// Dependencies
import OpenAI from 'openai'

// Types
import type { Dictionary } from '@rewordlabs/types'
import type { TranslateOptions } from './translate'

export async function translateWithChatGpt({
  dictionary,
  projectLocale,
  locale,
  openaiApiKey
}: Pick<
  TranslateOptions,
  'projectLocale' | 'dictionary' | 'locale' | 'openaiApiKey'
>) {
  const openai = new OpenAI({
    apiKey: openaiApiKey
  })

  const messagesJson = JSON.stringify(dictionary)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: [
          `Translate this JSON (from locale: ${projectLocale}} to locale: ${locale}`,
          'Do not translate the keys of the json',
          'Do not translate ${var}, just leave it as it is'
        ].join('.\n')
      },
      {
        role: 'user',
        content: messagesJson
      }
    ],
    temperature: 0.4,
    frequency_penalty: -2.0,
    presence_penalty: -2.0
  })

  return JSON.parse(
    response?.choices?.[0]?.message?.content || '{}'
  ) as Dictionary
}

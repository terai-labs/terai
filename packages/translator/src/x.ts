// Dependencies
import OpenAI from 'openai'

// Types
import type { Locale } from '@rewordlabs/types'

export async function getAiTranslation({
  messagesJson,
  projectLocale,
  locale,
  openaiApiKey
}: {
  messagesJson: string
  projectLocale: string
  locale: Locale
  openaiApiKey: string
}) {
  const openai = new OpenAI({
    apiKey: openaiApiKey
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: [
          `Translate this JSON (now in locale: ${projectLocale}} into this locale: ${locale}`,
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
    // max_tokens: 256,
    frequency_penalty: -2.0,
    presence_penalty: -2.0
  })

  return response?.choices?.[0]?.message?.content || '{}'
}

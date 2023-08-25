// Dependencies
import OpenAI from 'openai'

// Types
import type { Locale } from '@rosetta.js/types'

export async function getAiTranslation({
  messagesJson,
  projectLocale,
  locale
}: {
  messagesJson: string
  projectLocale: string
  locale: Locale
}) {
  const openai = new OpenAI({
    apiKey: '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'
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: [
          `Translate this JSON (now in locale: ${projectLocale}} into this locale: ${locale}`,
          'Do not translate the keys of the json',
          'Do not translate any of these ocurrences: @${VAR}, #${VAR}, !${VAR}, just leave them as they are'
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

// Dependencies
import OpenAI, { type ClientOptions } from 'openai'

// Types
import type { Dictionary, Translator } from '@rewordlabs/types'

export const createChatGptTranslator = (openaiOptions: ClientOptions) => {
  const openai = new OpenAI(openaiOptions)

  const translator: Translator = async ({
    dictionary,
    projectLocale,
    locale
  }) => {
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

  return translator
}

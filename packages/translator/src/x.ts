import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: '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'
})

export async function getAiTranslation({
  messagesJson,
  projectLocale,
  locale
}: {
  messagesJson: string
  projectLocale: string
  locale: string
}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    // model: 'text-davinci-003',
    messages: [
      {
        role: 'system',
        content: [
          `Translate this JSON (now in locale: ${projectLocale}} into this locale: ${locale}`,
          'Do not translate the keys of the json',
          'Keep white spaces and new lines',
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

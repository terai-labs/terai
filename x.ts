export async function getAiTranslation(json: string, locale: string) {
  const response = await this.openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    // model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          You will translate JSONs that I will pass to you into ${locale}.
          Do not translate the keys of the json.
          Keep white spaces and new lines.
          `
      },
      {
        role: 'user',
        content: json
      }
    ],
    temperature: 0.4,
    max_tokens: 256,
    frequency_penalty: -2.0,
    presence_penalty: -2.0
  })

  return response.data.choices[0].message.content
}

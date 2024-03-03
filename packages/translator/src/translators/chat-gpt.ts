// Dependencies
import OpenAI, { type ClientOptions } from 'openai'

// Types
import type { Dictionary, Translator } from '@terai/types'

export const createChatGptTranslator = (openaiOptions: ClientOptions) => {
	const openai = new OpenAI(openaiOptions)

	const translator: Translator = async ({
		dictionary,
		projectLocale,
		locale
	}) => {
		const messagesJson = JSON.stringify(dictionary)

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo-0125',
			messages: [
				{
					role: 'system',
					content: [
						// 'Act like a professional translator',
						`You will be provided with a JSON in locale: ${projectLocale}, and your task is to translate it to locale: ${locale}.`,
						// 'Keep the same structure and keys, just translate the values.',
						'Do not translate any escaped characters or "${var}" ocurrences, just keep them as they are'
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

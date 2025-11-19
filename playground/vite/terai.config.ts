import { defineConfig } from '@terai/dev'
import { createGroq } from '@ai-sdk/groq'
import { generateObject } from 'ai'
import { z } from 'zod'
import dedent from 'dedent'

const groq = createGroq({
	apiKey: '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'
})

// https://console.groq.com/docs/structured-outputs#supported-models
// const model = groq('openai/gpt-oss-20b');
const model = groq('openai/gpt-oss-120b')
// const model = groq('openai/gpt-oss-safeguard-20b');
// const model = groq('moonshotai/kimi-k2-instruct-0905');
// const model = groq('meta-llama/llama-4-maverick-17b-128e-instruct');
// const model = groq('meta-llama/llama-4-scout-17b-16e-instruct');

export default defineConfig({
	include: ['./src/**/*.{js,jsx,ts,tsx}'],
	exclude: [],
	projectLocale: 'en-GB',
	outDir: './locale',
	outLocales: ['en-GB', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'],
	translator: async ({ dictionary, locale, projectLocale }) => {
		const { object: translation } = await generateObject({
			mode: 'json',
			model: model,
			schema: z.record(z.string()),
			prompt: dedent`
								Translate the following JSON from "${projectLocale}" to "${locale}".
								<target-json>
									${JSON.stringify(dictionary, null, 2)}
								</target-json>
							`,
			system: dedent`
								# Translation Expert: ${projectLocale} → ${locale}
			
								## Your Role
								You are an elite translator and localization specialist with expertise in productivity 
								applications, task management, and time organization. Your translations are clear and 
								intuitive while maintaining natural, idiomatic language in the target locale.
	
								## Critical Requirements
								- Preserve all template variables (${
									// biome-ignore lint/suspicious/noTemplateCurlyInString: required
									'`${var}`'
								}) and escaped characters exactly as they appear
								- Maintain consistent terminology, voice, and style throughout all translations
			
								## Translation Guidelines
								- Use standard productivity and task management terminology appropriate for ${locale}
								- Adapt cultural references and idioms to resonate with the target locale
								- Prioritize clarity and ease of understanding over literal translation
								- Informal, conversational tone using direct language (avoid overly formal pronouns)
								- Ensure date/time formats and conventions follow ${locale} standards
			
								Super Critical Requirements:
								- OUTPUT ONLY a valid JSON object without any additional formatting or newlines in the values.
								- DO NOT INCLUDE MULTIPLE NEWLINE CHARACTERS in ANY STRING
								- You MUST keep the same KEY for each translation, do not mix them.
							`
		})

		return translation
	}
})

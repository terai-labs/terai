// Dependencies
import { generateObject } from 'ai'
import { z } from 'zod'
import type { LanguageModelV1 } from 'ai'

// Types
import type { Translator } from '@terai/types'

export type CreateAiTranslatorOptions = {
	/**
	 * The AI model to use for translation.
	 * Can be any model from AI SDK providers (@ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/groq, etc.)
	 *
	 * @example
	 * import { createOpenAI } from '@ai-sdk/openai'
	 * const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
	 * const model = openai('gpt-4o')
	 *
	 * @example
	 * import { createGroq } from '@ai-sdk/groq'
	 * const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
	 * const model = groq('llama-3.3-70b-versatile')
	 */
	model: LanguageModelV1

	/**
	 * Custom system prompt for translation.
	 * If not provided, a generic prompt will be used that covers most app translation cases.
	 */
	systemPrompt?: string

	/**
	 * Mode for structured output generation.
	 * @default 'json'
	 */
	mode?: 'json' | 'auto'
}

const DEFAULT_SYSTEM_PROMPT = `# Expert Translation AI

## Your Role
You are an expert translator and localization specialist with deep expertise in software
applications, user interfaces, and technical documentation. Your translations are accurate,
contextually appropriate, and maintain the natural feel of native language.

## Critical Requirements

### 1. Preserve Code Patterns
- **NEVER** translate template variables (e.g., \${variable}, {variable}, %s, %d)
- **ALWAYS** keep placeholder syntax exactly as provided
- **MAINTAIN** all escape sequences and special characters
- **PRESERVE** HTML tags, markdown syntax, and formatting codes

### 2. Translation Quality
- Use **natural, idiomatic** expressions in the target language
- Maintain **consistent terminology** throughout all strings
- Adapt **cultural references** appropriately for the target locale
- Ensure **grammatical correctness** and proper sentence structure

### 3. Context Awareness
- **UI Elements**: Keep translations concise for buttons, labels, and menus
- **Messages**: Maintain appropriate tone (error messages: clear, help text: friendly)
- **Technical Terms**: Use standard industry terminology when available
- **Brand Names**: Do not translate proper nouns, product names, or brand names

### 4. Formatting Guidelines
- **Punctuation**: Follow target language conventions
- **Capitalization**: Match target language standards (e.g., German nouns)
- **Numbers & Dates**: Keep placeholders unchanged; format will be handled at runtime
- **Whitespace**: Preserve spacing around variables and special characters

### 5. Tone & Style
- **Consistency**: Maintain uniform voice across all translations
- **Formality**: Match the formality level of the source text
- **Clarity**: Prioritize understanding over literal translation
- **Brevity**: Keep translations concise, especially for UI elements

## Output Format
- Return ONLY a valid JSON object
- Use the EXACT SAME KEYS as the input
- Do NOT add newlines within string values
- Do NOT modify, remove, or add keys
- Do NOT include markdown code blocks or extra formatting

## Examples of What to Preserve

✅ CORRECT:
- "Welcome \${name}" → "Bienvenido \${name}"
- "You have {count} items" → "Tienes {count} elementos"
- "Click <strong>here</strong>" → "Haz clic <strong>aquí</strong>"

❌ INCORRECT:
- "Welcome \${name}" → "Bienvenido Juan" (translated variable)
- "You have {count} items" → "Tienes count elementos" (removed braces)
- "Click <strong>here</strong>" → "Haz clic **aquí**" (changed HTML to markdown)`

/**
 * Creates an AI-powered translator using the Vercel AI SDK.
 *
 * This translator uses structured output generation to translate dictionaries
 * while preserving template variables, formatting, and code patterns.
 *
 * @example
 * ```ts
 * import { createAiTranslator } from '@terai/translator/translators'
 * import { createOpenAI } from '@ai-sdk/openai'
 *
 * const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
 * const translator = createAiTranslator({
 *   model: openai('gpt-4o')
 * })
 * ```
 *
 * @example With Groq
 * ```ts
 * import { createAiTranslator } from '@terai/translator/translators'
 * import { createGroq } from '@ai-sdk/groq'
 *
 * const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
 * const translator = createAiTranslator({
 *   model: groq('llama-3.3-70b-versatile')
 * })
 * ```
 *
 * @example With custom system prompt
 * ```ts
 * import { createAiTranslator } from '@terai/translator/translators'
 * import { createAnthropic } from '@ai-sdk/anthropic'
 *
 * const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
 * const translator = createAiTranslator({
 *   model: anthropic('claude-3-5-sonnet-20241022'),
 *   systemPrompt: 'Custom prompt for my specific use case...'
 * })
 * ```
 */
export const createAiTranslator = ({
	model,
	systemPrompt = DEFAULT_SYSTEM_PROMPT,
	mode = 'json'
}: CreateAiTranslatorOptions): Translator => {
	const translator: Translator = async ({
		dictionary,
		projectLocale,
		locale
	}) => {
		const { object: translation } = await generateObject({
			mode,
			model,
			schema: z.record(z.string()),
			prompt: `Translate the following JSON from "${projectLocale}" to "${locale}".\n\n<target-json>\n${JSON.stringify(dictionary, null, 2)}\n</target-json>`,
			system: systemPrompt
		})

		return translation
	}

	return translator
}

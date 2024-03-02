import type { Locale } from './locale'
import type { Translator } from './translator'

/**
 * Configuration for Terai
 */
export type Config = {
	/**
	 * List of files glob to to look for your locale declarations
	 */
	include: string[]

	/**
	 * List of files glob to ignore
	 */
	exclude?: string[]

	/**
	 * The output directory for your locale system
	 */
	outDir: string

	/**
	 * The base locale used in your project messages
	 */
	projectLocale: Locale

	/**
	 * The aditional locales you want to support
	 */
	outLocales: Locale[]

	/**
	 * The translator for your messages
	 */
	translator: Translator
}

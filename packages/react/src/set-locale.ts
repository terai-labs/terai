// Dependencies
import { setup$ } from './setup'

// Types
import type { Locale } from '@koi18n/types'

export const setLocale = (locale: Locale) => setup$.locale.set(locale)

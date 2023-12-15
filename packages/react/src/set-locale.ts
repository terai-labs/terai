// Dependencies
import { setup$ } from './setup'

// Types
import type { Locale } from '@terai/types'

export const setLocale = (locale: Locale) => setup$.locale.set(locale)

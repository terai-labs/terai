// Dependencies
import { cookies, headers } from 'next/headers'

// Constants
import { LOCALE_COOKIE, LOCALE_HEADER } from './constants'
import type { Locale } from '@rewordlabs/types'

export const getLocaleCache = (): Locale | null => {
  let locale: Locale | null = null

  locale = headers().get(LOCALE_HEADER) as Locale

  if (!locale) {
    locale = cookies().get(LOCALE_COOKIE)?.value as Locale
  }

  if (!locale) {
    throw new Error('Could not get the locale from the headers or cookies.')
  }

  return locale
}

// Dependencies
import { cookies, headers } from 'next/headers'

// Constants
import { LOCALE_COOKIE, LOCALE_HEADER } from '../constants'

// Types
import type { Locale } from '@rewordlabs/types'

export const getLocale = (): Locale => {
  const localeFromHeaders = headers().get(LOCALE_HEADER)

  if (localeFromHeaders) {
    return localeFromHeaders as Locale
  }

  const localeFromCookies = cookies().get(LOCALE_COOKIE)?.value

  if (localeFromCookies) {
    return localeFromCookies as Locale
  }

  console.error('Could not get the locale from the headers or cookies.')
  return 'en'
}

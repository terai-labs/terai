'use client'

// Dependencies
import { useParams } from 'next/navigation'

// Constants
import { LOCALE_COOKIE, LOCALE_SEGMENT_NAME } from '../constants'

// Types
import type { Locale } from '@koi18n/types'

export function useLocale(): string {
  const params = useParams()
  const paramsLocale = params[LOCALE_SEGMENT_NAME] as Locale
  const cookieLocale = getCookieLocale()

  return cookieLocale ?? paramsLocale
}

const getCookieLocale = () => {
  if (typeof document === 'undefined') return null

  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${LOCALE_COOKIE}=`))
    ?.split('=')[1] as Locale
}

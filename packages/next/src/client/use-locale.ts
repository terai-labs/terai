'use client'

// Dependencies
import { useParams } from 'next/navigation'

// Types
import type { Locale } from '@koi18n/types'

const LOCALE_SEGMENT_NAME = 'locale'

export function useLocale(): string {
  const params = useParams()

  return params[LOCALE_SEGMENT_NAME] as Locale
}

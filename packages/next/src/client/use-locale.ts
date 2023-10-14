'use client'

// Dependencies
import { useParams } from 'next/navigation'

// Constants
import { LOCALE_SEGMENT_NAME } from '../constants'

// Types
import type { Locale } from '@koi18n/types'

export function useLocale(): string {
  const params = useParams()

  return params[LOCALE_SEGMENT_NAME] as Locale
}

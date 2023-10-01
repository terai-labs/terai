import { useParams } from 'next/navigation'
import { LOCALE_SEGMENT_NAME } from '../constants'

export function useLocale(): string {
  let locale
  const params = useParams() as ReturnType<typeof useParams> | null

  if (typeof params?.[LOCALE_SEGMENT_NAME] === 'string') {
    return params[LOCALE_SEGMENT_NAME]
  }

  return locale ?? 'es'
}

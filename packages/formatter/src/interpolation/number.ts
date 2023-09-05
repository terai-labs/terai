// Types
import type { Locale } from '@rewordlabs/types'

export type FormatNumberOptions = {
  value: Parameters<Intl.NumberFormat['format']>[0]
  locale: Locale
  options?: Intl.NumberFormatOptions
}

export function formatNumber({
  value,
  locale,
  options
}: FormatNumberOptions): ReturnType<Intl.NumberFormat['format']> {
  const formatter = new Intl.NumberFormat(locale, options)

  return formatter.format(value)
}

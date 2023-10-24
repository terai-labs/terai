'use client'

// Dependencies
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { useLocale } from '../client/use-locale'

// Types
import type { ComponentProps } from 'react'
import type { Locale } from '@koi18n/types'

type Props = Omit<ComponentProps<typeof NextLink>, 'locale'> & {
  locale?: Locale
}

export const Link = forwardRef(
  (
    { href, locale: localeProp, prefetch, ...rest }: Props,
    ref: Props['ref']
  ) => {
    const currentLocale = useLocale()
    const isChangingLocale = localeProp !== currentLocale
    const locale = localeProp ?? currentLocale
    const localizedHref = `/${locale}${href}`

    if (isChangingLocale && prefetch) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          'The `prefetch` prop is currently not supported when using the `locale` prop on `Link` to switch the locale.`'
        )
      }
      prefetch = false
    }

    return (
      <NextLink
        ref={ref}
        href={localizedHref}
        prefetch={prefetch}
        locale={locale}
        {...rest}
      />
    )
  }
)

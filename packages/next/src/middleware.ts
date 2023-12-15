// Dependencies
import { NextRequest, NextResponse } from 'next/server'

// Constants
import { LOCALE_COOKIE } from './constants'

// Types
import type { Locale } from '@terai/types'

type CreateMiddlewareOptions = {
  locales: Locale[]
  defaultLocale: Locale
}

export const createMiddleware =
  ({ locales, defaultLocale }: CreateMiddlewareOptions) =>
  (request: NextRequest) => {
    const requestUrl = request.nextUrl.clone()
    const fallbackLocale = getFallbackLocale({
      defaultLocale,
      locales,
      request
    })

    if (!hasLocalePrefix(locales, requestUrl.pathname)) {
      const mappedUrl = requestUrl.clone()
      mappedUrl.pathname = `/${fallbackLocale}${mappedUrl.pathname}`
      const response = NextResponse.redirect(mappedUrl)

      const responseWithLocale = addLocaleToResponse(response, fallbackLocale)
      return responseWithLocale
    } else {
      const response = NextResponse.next()
      const requestLocale = request.nextUrl.pathname.split('/')?.[1] as Locale
      const responseWithLocale = addLocaleToResponse(
        response,
        requestLocale && locales.includes(requestLocale)
          ? requestLocale
          : fallbackLocale
      )

      return responseWithLocale
    }
  }

function hasLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.some(locale => {
    return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  })
}

function addLocaleToResponse(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale)

  return response
}

function getFallbackLocale({
  defaultLocale,
  locales,
  request
}: {
  defaultLocale: Locale
  locales: Locale[]
  request: NextRequest
}) {
  const cookiesLocale = request.cookies.get(LOCALE_COOKIE)?.value

  if (cookiesLocale) return cookiesLocale

  const header = request.headers.get('Accept-Language')
  const headerLocale = header?.split(',')?.[0]?.split('-')?.[0]

  if (headerLocale && locales.includes(headerLocale))
    return headerLocale as Locale

  return defaultLocale
}

import { NextRequest, NextResponse } from 'next/server'
import type { Locale } from '@rewordlabs/types'
import { LOCALE_COOKIE, LOCALE_HEADER } from './server/constants'

type CreateMiddlewareOptions = {
  /**
   * When a url is not prefixed with a locale, this setting determines whether the middleware should perform a *redirect* or *rewrite* to the default locale.
   *
   * **redirect**: `https://example.com/products` -> *redirect* to `https://example.com/en/products` -> client sees the locale in the url
   *
   * **rewrite**: `https://example.com/products` -> *rewrite* to `https://example.com/en/products` -> client doesn't see the locale in the url
   *
   * @default redirect
   */
  urlMappingStrategy?: 'redirect' | 'rewrite'

  /**
   * Override the resolution of a locale from a `Request`, which by default will try to extract it from the `Accept-Language` header. This can be useful to force the use of a specific locale regardless of the `Accept-Language` header.
   *
   * @description This function will only be called if the user doesn't already have a `Next-Locale` cookie.
   */
  resolveLocaleFromRequest?: (request: NextRequest) => Locale
}

export function createMiddleware(
  locales: Locale[],
  defaultLocale: Locale,
  config?: CreateMiddlewareOptions
) {
  return function (request: NextRequest) {
    const requestUrl = request.nextUrl.clone()

    const locale =
      localeFromRequest(locales, request, config?.resolveLocaleFromRequest) ??
      defaultLocale

    if (noLocalePrefix(locales, requestUrl.pathname)) {
      const mappedUrl = requestUrl.clone()
      mappedUrl.pathname = `/${locale}${mappedUrl.pathname}`

      const strategy = config?.urlMappingStrategy ?? 'redirect'

      if (strategy === 'rewrite') {
        const response = NextResponse.rewrite(mappedUrl)
        return addLocaleToResponse(response, locale)
      } else {
        if (strategy !== 'redirect') {
          console.warn(
            `Invalid urlMappingStrategy: ${strategy}. Defaulting to redirect.`
          )
        }

        const response = NextResponse.redirect(mappedUrl)
        return addLocaleToResponse(response, locale)
      }
    }

    const response = NextResponse.next()
    const requestLocale = (request.nextUrl.pathname.split('/')?.[1] ??
      locale) as Locale

    if (locales.includes(requestLocale)) {
      return addLocaleToResponse(response, requestLocale)
    }

    return response
  }
}

function localeFromRequest<Locales extends readonly string[]>(
  locales: Locales,
  request: NextRequest,
  resolveLocaleFromRequest: CreateMiddlewareOptions['resolveLocaleFromRequest'] = defaultResolveLocaleFromRequest
) {
  let locale = request.cookies.get(LOCALE_COOKIE)?.value ?? null

  if (!locale && resolveLocaleFromRequest) {
    locale = resolveLocaleFromRequest(request)
  }

  if (!locale || !locales.includes(locale)) {
    locale = null
  }

  return locale
}

const defaultResolveLocaleFromRequest: CreateMiddlewareOptions['resolveLocaleFromRequest'] =
  request => {
    const header = request.headers.get('Accept-Language')
    const locale = header?.split(',')?.[0]?.split('-')?.[0]
    return (locale as Locale) ?? null
  }

function noLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.every(locale => {
    return !(pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  })
}

function addLocaleToResponse(response: NextResponse, locale: string) {
  response.headers.set(LOCALE_HEADER, locale)
  response.cookies.set(LOCALE_COOKIE, locale)
  return response
}

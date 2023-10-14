import { createMiddleware } from '@koi18n/next/middleware'

export const middleware = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

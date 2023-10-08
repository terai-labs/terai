import { createMiddleware } from '@koi18n/next/middleware'

export const middleware = createMiddleware(['en', 'es'], 'en', {
  // urlMappingStrategy: 'rewrite'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

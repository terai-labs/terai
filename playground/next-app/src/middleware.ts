import { createMiddleware } from '@tsmu/next'

export const middleware = createMiddleware(['en', 'es'], 'en')

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

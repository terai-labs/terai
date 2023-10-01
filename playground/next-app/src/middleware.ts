import { createMiddleware } from '@rewordlabs/next'

export const middleware = createMiddleware(['en', 'es'], 'en')

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

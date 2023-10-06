import { createMiddleware } from '@tsmu/next/middleware'

export const middleware = createMiddleware(['en', 'es'], 'en', {
  urlMappingStrategy: 'rewrite'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

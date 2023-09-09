import { createMiddleware } from '@rewordlabs/next'

export const middleware = createMiddleware(['en', 'es'], 'es')

export const config = {
  matcher: ['/((?!_next).*)']
}

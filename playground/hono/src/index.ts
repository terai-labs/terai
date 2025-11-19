import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { setup, getTs, getFormat, setLocale, getLocale } from '@terai/node'

// Initialize Terai
setupTerai({
	defaultLocale: 'en-US',
	loader: async (locale: string) => {
		// Dynamic import of locale files
		const dictionary = await import(`../locale/${locale}/${locale}.json`)
		return dictionary.default
	}
})

const app = new Hono()

// Middleware to set locale from query param or header
app.use('*', async (c, next) => {
	const localeParam = c.req.query('locale')
	const localeHeader = c.req.header('Accept-Language')

	const requestedLocale = localeParam || localeHeader?.split(',')[0] || 'en'

	// Set locale for this request
	if (requestedLocale.includes('es')) {
		setLocale('es-ES')
	} else if (requestedLocale.includes('en')) {
		setLocale('en-US')
	} else {
		setLocale('en-US')
	}

	await next()
})

// Health check endpoint
app.get('/', (c) => {
	return c.json({
		message: 'Terai + Hono API Playground',
		status: 'healthy',
		currentLocale: getLocale()
	})
})

// Simple greeting endpoint
app.get('/greet/:name', async (c) => {
	const name = c.req.param('name')
	const ts = await getTs()

	const greeting = ts`Hello, ${name}!`

	return c.json({
		message: greeting,
		locale: getLocale()
	})
})

// Welcome endpoint
app.get('/welcome', async (c) => {
	const ts = await getTs()
	const welcome = ts`Welcome to our API`

	return c.json({
		message: welcome,
		locale: getLocale()
	})
})

// Time endpoint with formatting
app.get('/time', async (c) => {
	const ts = await getTs()
	const format = getFormat()

	const now = new Date()
	const formattedTime = format.date(now, {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	const message = ts`The current time is ${formattedTime}`

	return c.json({
		message,
		locale: getLocale(),
		timestamp: now.toISOString()
	})
})

// Locale info endpoint
app.get('/locale', (c) => {
	return c.json({
		currentLocale: getLocale(),
		supportedLocales: ['en', 'es']
	})
})

// Endpoint to demonstrate number formatting
app.get('/stats', async (c) => {
	const format = getFormat()

	const stats = {
		users: format.number(12345, { style: 'decimal' }),
		revenue: format.number(99999.99, {
			style: 'currency',
			currency: 'USD'
		}),
		percentage: format.number(0.856, {
			style: 'percent',
			minimumFractionDigits: 1
		})
	}

	return c.json({
		stats,
		locale: getLocale()
	})
})

const port = Number(process.env.PORT || 3000)

console.log(`🔥 Hono + Terai API running on http://localhost:${port}`)
console.log(`📝 Try these endpoints:`)
console.log(`   GET  http://localhost:${port}/`)
console.log(`   GET  http://localhost:${port}/greet/World`)
console.log(`   GET  http://localhost:${port}/greet/World?locale=es`)
console.log(`   GET  http://localhost:${port}/welcome`)
console.log(`   GET  http://localhost:${port}/time`)
console.log(`   GET  http://localhost:${port}/stats`)
console.log(`   GET  http://localhost:${port}/locale`)
console.log(`   GET  http://localhost:${port}/user/123`)
console.log(`   GET  http://localhost:${port}/user/404`)
console.log(`   POST http://localhost:${port}/process`)

serve({
	fetch: app.fetch,
	port
})

import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '@terai/logger'
import open from 'open'
import { getStudioData } from './api/data'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export type StartStudioOptions = {
	cwd: string
	port?: number
	open?: boolean
}

const MIME_TYPES: Record<string, string> = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.mjs': 'application/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf'
}

export async function startStudio(options: StartStudioOptions): Promise<void> {
	const { cwd, port = 3333, open: shouldOpen = true } = options

	// Path to the built client assets
	const clientDir = join(__dirname, 'client')

	// Pre-load studio data
	let studioData: Awaited<ReturnType<typeof getStudioData>> | null = null
	try {
		studioData = await getStudioData({ cwd })
	} catch (error) {
		if (error instanceof Error) {
			logger.error('Studio:', error.message)
		}
		process.exit(1)
	}

	const server = createServer(async (req, res) => {
		const url = req.url || '/'

		// CORS headers for development
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

		if (req.method === 'OPTIONS') {
			res.writeHead(204)
			res.end()
			return
		}

		// API endpoint
		if (url === '/api/data') {
			try {
				// Refresh data on each request
				studioData = await getStudioData({ cwd })
				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(JSON.stringify(studioData))
			} catch (error) {
				res.writeHead(500, { 'Content-Type': 'application/json' })
				res.end(
					JSON.stringify({
						error: error instanceof Error ? error.message : 'Unknown error'
					})
				)
			}
			return
		}

		// Serve static files
		let filePath = join(clientDir, url === '/' ? 'index.html' : url)

		// Handle SPA routing - serve index.html for non-file routes
		if (!existsSync(filePath) || !statSync(filePath).isFile()) {
			filePath = join(clientDir, 'index.html')
		}

		if (existsSync(filePath) && statSync(filePath).isFile()) {
			const ext = extname(filePath)
			const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

			try {
				const content = readFileSync(filePath)
				res.writeHead(200, { 'Content-Type': mimeType })
				res.end(content)
			} catch {
				res.writeHead(500, { 'Content-Type': 'text/plain' })
				res.end('Internal Server Error')
			}
		} else {
			res.writeHead(404, { 'Content-Type': 'text/plain' })
			res.end('Not Found')
		}
	})

	return new Promise((resolve, reject) => {
		server.on('error', (err: NodeJS.ErrnoException) => {
			if (err.code === 'EADDRINUSE') {
				logger.error(
					'Studio:',
					`Port ${port} is already in use. Try a different port with --port`
				)
			} else {
				logger.error('Studio:', err.message)
			}
			reject(err)
		})

		server.listen(port, () => {
			const url = `http://localhost:${port}`
			logger.log('')
			logger.info('Studio:', `Running at ${logger.colors.cyan(url)}`)
			logger.log('')
			logger.info(
				'',
				`Loaded ${studioData?.messages.length || 0} messages across ${studioData?.outLocales.length || 0} locales`
			)
			logger.log('')
			logger.info('', 'Press Ctrl+C to stop')
			logger.log('')

			if (shouldOpen) {
				open(url)
			}

			// Keep the process running
			process.on('SIGINT', () => {
				logger.log('')
				logger.info('Studio:', 'Shutting down...')
				server.close()
				resolve()
			})
		})
	})
}

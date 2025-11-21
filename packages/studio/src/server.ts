import {
	createServer,
	type IncomingMessage,
	type ServerResponse
} from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
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
	'.html': 'text/html; charset=utf-8',
	'.js': 'application/javascript; charset=utf-8',
	'.mjs': 'application/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf'
}

// Cache for static files (in-memory for better performance)
const fileCache = new Map<string, { content: Buffer; mtime: number }>()

async function serveStaticFile(
	filePath: string,
	res: ServerResponse
): Promise<boolean> {
	try {
		const stats = await stat(filePath)
		if (!stats.isFile()) return false

		const ext = extname(filePath)
		const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

		// Check cache
		const cached = fileCache.get(filePath)
		if (cached && cached.mtime === stats.mtimeMs) {
			res.writeHead(200, {
				'Content-Type': mimeType,
				'Cache-Control': 'public, max-age=31536000, immutable'
			})
			res.end(cached.content)
			return true
		}

		// Read and cache file
		const content = await readFile(filePath)
		fileCache.set(filePath, { content, mtime: stats.mtimeMs })

		// Set cache headers (immutable for hashed assets)
		const cacheControl = filePath.includes('/assets/')
			? 'public, max-age=31536000, immutable'
			: 'public, max-age=0, must-revalidate'

		res.writeHead(200, {
			'Content-Type': mimeType,
			'Cache-Control': cacheControl
		})
		res.end(content)
		return true
	} catch {
		return false
	}
}

function sendJson(res: ServerResponse, data: unknown, status = 200): void {
	res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
	res.end(JSON.stringify(data))
}

function sendError(res: ServerResponse, message: string, status = 500): void {
	sendJson(res, { error: message }, status)
}

// Sanitize URL path to prevent directory traversal
function sanitizePath(urlPath: string): string {
	// Normalize and ensure path doesn't escape the root
	const normalized = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
	// Remove leading slashes and decode
	return decodeURIComponent(normalized.replace(/^\/+/, ''))
}

async function handleRequest(
	req: IncomingMessage,
	res: ServerResponse,
	clientDir: string,
	cwd: string
): Promise<void> {
	const url = new URL(req.url || '/', `http://${req.headers.host}`)
	const pathname = url.pathname

	// CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	if (req.method === 'OPTIONS') {
		res.writeHead(204)
		res.end()
		return
	}

	// Only allow GET requests
	if (req.method !== 'GET') {
		sendError(res, 'Method not allowed', 405)
		return
	}

	// API endpoint
	if (pathname === '/api/data') {
		try {
			const studioData = await getStudioData({ cwd })
			sendJson(res, studioData)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error'
			logger.error('API:', message)
			sendError(res, message)
		}
		return
	}

	// Serve static files with path traversal protection
	const safePath = sanitizePath(pathname)
	const filePath = join(clientDir, safePath || 'index.html')

	// Ensure resolved path is still within clientDir
	if (!filePath.startsWith(clientDir)) {
		sendError(res, 'Forbidden', 403)
		return
	}

	// Try to serve the file
	if (await serveStaticFile(filePath, res)) {
		return
	}

	// SPA fallback - serve index.html for client-side routing
	const indexPath = join(clientDir, 'index.html')
	if (await serveStaticFile(indexPath, res)) {
		return
	}

	res.writeHead(404, { 'Content-Type': 'text/plain' })
	res.end('Not Found')
}

export async function startStudio(options: StartStudioOptions): Promise<void> {
	const { cwd, port = 3333, open: shouldOpen = true } = options

	const clientDir = join(__dirname, 'client')

	// Validate that client directory exists and has index.html
	try {
		await stat(join(clientDir, 'index.html'))
	} catch {
		logger.error(
			'Studio:',
			'Client assets not found. Please rebuild the package.'
		)
		process.exit(1)
	}

	// Pre-validate config and manifest
	let initialData: Awaited<ReturnType<typeof getStudioData>>
	try {
		initialData = await getStudioData({ cwd })
	} catch (error) {
		if (error instanceof Error) {
			logger.error('Studio:', error.message)
		}
		process.exit(1)
	}

	const server = createServer((req, res) => {
		handleRequest(req, res, clientDir, cwd).catch((error) => {
			logger.error(
				'Server:',
				error instanceof Error ? error.message : 'Unknown error'
			)
			if (!res.headersSent) {
				sendError(res, 'Internal server error')
			}
		})
	})

	// Track if we've already set up the shutdown handler
	let shutdownHandlerRegistered = false

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

			const messageCount = initialData.messages.length
			const localeCount = initialData.outLocales.length
			const missingCount = initialData.messages.reduce((acc, msg) => {
				return (
					acc +
					initialData.outLocales.filter(
						(l) => l !== initialData.projectLocale && !msg.translations[l]
					).length
				)
			}, 0)

			logger.info(
				'',
				`${messageCount} messages, ${localeCount} locales, ${missingCount} missing translations`
			)
			logger.log('')
			logger.info('', 'Press Ctrl+C to stop')
			logger.log('')

			if (shouldOpen) {
				open(url)
			}

			// Only register shutdown handler once
			if (!shutdownHandlerRegistered) {
				shutdownHandlerRegistered = true
				process.on('SIGINT', () => {
					logger.log('')
					logger.info('Studio:', 'Shutting down...')
					server.close()
					resolve()
				})
			}
		})
	})
}

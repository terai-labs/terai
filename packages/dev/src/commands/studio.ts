// Dependencies
import { startStudio } from '@terai/studio'
import { logger } from '@terai/logger'

// Types
import type { CAC } from 'cac'

export type StudioOptions = {
	cwd: string
	port?: number
	open?: boolean
}

export function createStudioCommand(cli: CAC, cwd: string) {
	return cli
		.command('studio', 'Launch the visual translation management interface')
		.option('--cwd <cwd>', 'Current working directory', { default: cwd })
		.option('-p, --port <port>', 'Port to run the studio on', { default: 3333 })
		.option('--no-open', 'Do not automatically open the browser')
		.action(studioCmd)
}

export async function studioCmd(options: StudioOptions) {
	logger.heading('studio', 'Visual translation management interface')

	const port =
		typeof options.port === 'string' ? parseInt(options.port, 10) : options.port

	await startStudio({
		cwd: options.cwd,
		port,
		open: options.open !== false
	})
}

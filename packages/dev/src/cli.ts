// Dependencies
import { cac } from 'cac'
import { runtime } from '@terai/runtime'
import { logger } from '@terai/logger'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import {
	createExtractCommand,
	createInitCommand,
	createTranslateCommand
} from './commands'

export async function main() {
	updateNotifier({ pkg, distTag: 'latest' }).notify()
	logger.log(
		`${logger.colors.bold('terai')} ${logger.colors.cyan(`v${pkg.version}`)}`
	)

	const cwd = runtime.cwd()
	const cli = cac('terai')

	createInitCommand(cli, cwd)
	createExtractCommand(cli, cwd)
	createTranslateCommand(cli, cwd)

	cli.help()
	cli.version(pkg.version)
	cli.parse(process.argv, { run: false })

	try {
		await cli.runMatchedCommand()
	} catch (error) {
		if (error instanceof Error) logger.error(error.message)

		process.exit(1)
	}
}

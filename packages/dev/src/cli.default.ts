#!/usr/bin/env node

import { main } from './cli'
import { isMainThread, parentPort } from 'node:worker_threads'
import chalk from 'chalk'

main().catch((error: any) => {
	if (error.loc) {
		console.error(
			chalk.bold(
				chalk.red(
					`Error parsing: ${error.loc.file}:${error.loc.line}:${error.loc.column}`
				)
			)
		)
	}

	if (error.frame) {
		console.error(chalk.red(error.message))
		console.error(chalk.dim(error.frame))
	} else {
		console.error(chalk.red(error.message))
	}

	process.exitCode = 1

	if (!isMainThread && parentPort) {
		parentPort.postMessage('error')
	}
})

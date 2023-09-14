#!/usr/bin/env node

import { main } from './cli'
import { isMainThread, parentPort } from 'worker_threads'

main().catch((error: any) => {
  if (error.loc) {
    console.error(
      `Error parsing: ${error.loc.file}:${error.loc.line}:${error.loc.column}`
    )
  }

  if (error.frame) {
    console.error(error.message)
    console.error(error.frame)
  } else {
    console.error(error.message)
  }

  process.exitCode = 1

  if (!isMainThread && parentPort) {
    parentPort.postMessage('error')
  }
})

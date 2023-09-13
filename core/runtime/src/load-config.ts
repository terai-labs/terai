// Dependencies
import { bundleNRequire } from 'bundle-n-require'
import { findConfig } from './find-config'
import { logger } from '@rewordlabs/logger'

// Types
import type { Config } from '@rewordlabs/types'

export async function loadConfig({
  cwd,
  filePath
}: {
  cwd: string
  filePath?: string
}) {
  const config = findConfig({ cwd, filePath })

  if (!config) {
    throw new Error('Config not found')
  }

  logger.debug('config:path', filePath)

  const parsedConfig = await bundle(config, cwd)

  if (typeof parsedConfig !== 'object') {
    throw new Error(`💥 Config must export or return an object.`)
  }

  return parsedConfig
}

export async function bundle<T = Config>(filepath: string, cwd: string) {
  const { mod: config } = await bundleNRequire(filepath, {
    cwd,
    interopDefault: true
  })

  return (config?.default ?? config) as T
}

import { runtime } from './runtime'

const configs = ['.ts', '.js', '.mjs', '.cjs']

export function findConfig({
  cwd,
  filePath
}: {
  cwd: string
  filePath?: string
}) {
  if (filePath) return runtime.path.resolve(cwd, filePath)

  for (const config of configs) {
    // const path = runtime.path.resolve(cwd, `terai.config${config}`)
    // const exists = runtime.fs.exists(path)
    const exists = runtime.fs.findUp(`terai.config${config}`)

    if (exists) return exists
  }
}

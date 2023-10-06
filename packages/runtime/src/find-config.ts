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
    // const path = runtime.path.resolve(cwd, `tsmu.config${config}`)
    // const exists = runtime.fs.exists(path)
    const exists = runtime.fs.findUp(`tsmu.config${config}`)

    if (exists) return exists
  }
}

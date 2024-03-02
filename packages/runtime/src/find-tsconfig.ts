import { runtime } from './runtime'

export function findTsConfig() {
	return runtime.fs.findUp('tsconfig.json')
}

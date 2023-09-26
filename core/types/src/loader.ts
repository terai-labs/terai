import type { Dictionary } from './dictionary'

export type Loader = (
  locale: string,
  chunkId: string
) => Promise<{ default: Dictionary }>

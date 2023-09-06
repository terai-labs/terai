// Types
import { getTx } from './tx'

export type SetupOptions = {
  loader: (locale: string, id: string) => Promise<string>
}

export function setupServer({ loader }: SetupOptions) {
  return {
    tx: getTx({ loader })
  }
}

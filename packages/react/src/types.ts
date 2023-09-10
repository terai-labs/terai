import type { ReactNode } from 'react'

export type CommonSetupOptions = {
  loader: (locale: string, id: string) => Promise<string>
  components?: InterpolateComponents
}

export type InterpolateComponents = Record<
  string,
  (children: ReactNode) => ReactNode
>

// Dependencies
import { createTx, format } from '@rewordlabs/formatter'

// Types
import type { Locale } from '@rewordlabs/types'
import type { InterpolateOptions } from '@rewordlabs/formatter'

// Components
import { text } from './text'

export type SetupOptions = InterpolateOptions & {
  getLocale: () => Locale
  loader: (locale: string, id: string) => Promise<string>
}

export const setup = ({ getLocale, loader, ...global }: SetupOptions) => {
  const tx = createTx<Promise<string>, unknown>({
    loader,
    getLocale,
    render: props => text({ ...props, global })
  })

  return {
    tx,
    format
  }
}

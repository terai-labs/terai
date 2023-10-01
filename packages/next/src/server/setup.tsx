// Dependencies
import { createTx } from '@rewordlabs/tx'
import { getLocaleCache } from './get-locale-cache'
import { createFormat } from '@rewordlabs/formatter'

// Components
import { Suspense } from 'react'
import { SSRText } from './text'

// Types
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react'

export type SetupServerOptions = CommonSetupOptions

export function setupServer({
  loader,
  components = {},
  format = {}
}: SetupServerOptions) {
  const useFormat = createFormat(getLocaleCache)

  const tx = createTx<ReactNode, TxReactOptions>({
    render: props => {
      return (
        <Suspense>
          {/* @ts-ignore */}
          <SSRText
            {...props}
            loader={loader}
            components={{
              ...components,
              ...props.components
            }}
            format={{
              ...format,
              ...props.format
            }}
          />
        </Suspense>
      )
    }
  })

  return {
    tx,
    useFormat
  }
}

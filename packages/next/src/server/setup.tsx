// Dependencies
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { getLocale } from './get-locale'
import { SsrText } from './text'

// Types
import type { ReactNode } from 'react'
import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react'

export function setupServer({
  loader,
  components = {},
  format = {}
}: CommonSetupOptions) {
  const getFormat = createFormat(getLocale)
  const tx = createTx<ReactNode, TxReactOptions>({
    render: props => {
      return (
        // @ts-ignore
        <SsrText
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
      )
    }
  })

  return {
    tx,
    getFormat
  }
}

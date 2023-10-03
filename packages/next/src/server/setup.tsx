// Dependencies
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { getLocale } from './get-locale'
import { SsrText } from './text'

// Types
import type { CommonSetupOptions, TxReactRenderProps } from '@rewordlabs/react'

export function setupServer({
  loader,
  components = {},
  format = {}
}: CommonSetupOptions) {
  const getFormat = createFormat(getLocale)
  const tx = createTx<JSX.Element, TxReactRenderProps>({
    render: props => {
      return (
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

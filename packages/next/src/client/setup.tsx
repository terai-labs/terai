// Dependencies
import { createFormat } from '@rewordlabs/formatter'
import { createTx } from '@rewordlabs/tx'
import { createUseDictionary } from './use-dictionary'
import { CsrText } from './text'
import { QueryClient } from '@tanstack/react-query'
import { useLocale } from './use-locale'

// Types
import type {
  CommonSetupOptions,
  TxReactRenderProps
} from '@rewordlabs/react/core'

export const setupClient = ({
  loader,
  components = {},
  format = {}
}: CommonSetupOptions) => {
  const queryClient = new QueryClient()
  const useFormat = createFormat(useLocale)
  const useDictionary = createUseDictionary(queryClient)
  const tx = createTx<JSX.Element, TxReactRenderProps>({
    render: props => {
      return (
        <CsrText
          {...props}
          useDictionary={useDictionary}
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
    useFormat
  }
}

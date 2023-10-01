import type { CommonSetupOptions, TxReactOptions } from '@rewordlabs/react'
import type { TxRenderProps } from '@rewordlabs/tx'

export type TextProps<T> = CommonSetupOptions &
  TxRenderProps<T> &
  TxReactOptions

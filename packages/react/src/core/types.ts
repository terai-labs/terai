import type { InterpolateComponents } from './interpolate'
import type { InterpolateOptions } from '@rewordlabs/formatter'
import type { TxRenderProps } from '@rewordlabs/tx'
import type { Loader } from '@rewordlabs/types'

export type TxReactRenderProps = TxRenderProps & {
  components: InterpolateComponents
}

export type CommonSetupOptions = TxReactRenderProps &
  InterpolateOptions & {
    loader: Loader
  }

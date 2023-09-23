import type { InterpolateComponents } from './interpolate'
import type { TxRenderProps } from '@rewordlabs/tx'
import type { InterpolateOptions } from '@rewordlabs/formatter'
import type { Loader } from '@rewordlabs/types'

export type TxReactOptions = {
  components?: InterpolateComponents
}

export type CommonSetupOptions = InterpolateOptions & {
  loader: Loader
} & TxReactOptions

export type TextProps = TxRenderProps<TxReactOptions> & {
  global: Pick<CommonSetupOptions, 'components' | 'format' | 'plugins'>
}

import type { InterpolateComponents } from './interpolate'
import type { InterpolateOptions, TxRenderProps } from '@rewordlabs/formatter'
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

import type { InterpolateComponents } from './interpolate'
import type { InterpolateOptions, TxRenderProps } from '@rewordlabs/formatter'

export type TxReactOptions = {
  components?: InterpolateComponents
}

export type CommonSetupOptions = InterpolateOptions & {
  loader: (locale: string, id: string) => Promise<string>
} & TxReactOptions

export type TextProps = TxRenderProps<TxReactOptions> & {
  global: Pick<CommonSetupOptions, 'components' | 'format' | 'plugins'>
}

// Types
import type { InterpolateComponents } from './interpolate'
import type { InterpolateOptions } from '@rewordlabs/formatter'
import type { TxRenderProps } from '@rewordlabs/tx'
import type { Loader, Locale } from '@rewordlabs/types'

export type CreateSetupOptions = {
  getLocale: () => Locale
}

export type SetupReactOptions = InterpolateOptions & {
  loader: Loader
  components?: InterpolateComponents
}

export type TxReactRenderProps = TxRenderProps & {
  components: InterpolateComponents
}
export type TextProps = SetupReactOptions &
  TxReactRenderProps &
  CreateSetupOptions

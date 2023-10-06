// Types
import type { InterpolateComponents } from './interpolate'
import type { InterpolateOptions } from '@tsmu/formatter'
import type { TsRenderProps } from '@tsmu/ts'
import type { Loader, Locale } from '@tsmu/types'

export type CreateSetupOptions = {
  getLocale: () => Locale
}

export type SetupReactOptions = InterpolateOptions & {
  loader: Loader
  components?: InterpolateComponents
}

export type TsReactRenderProps = TsRenderProps & {
  components: InterpolateComponents
}
export type TextProps = SetupReactOptions &
  TsReactRenderProps &
  CreateSetupOptions

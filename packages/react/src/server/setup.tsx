// Dependencies
import { Suspense, type ReactNode } from 'react'
import { createTx, type InterpolateOptions } from '@rewordlabs/formatter'

// Types
import type { Locale } from '@rewordlabs/types'

// Components
import { Text } from './text'
import { createInterpolate } from '../interpolate'
import type { CommonSetupOptions } from '../types'

export type SetupServerOptions = InterpolateOptions & CommonSetupOptions

export type CreateSetupServerOptions = {
  getLocale: () => Locale
}

export const createSetupServer =
  ({ getLocale }: CreateSetupServerOptions) =>
  ({
    loader,
    components,
    ...interpolateOptions
  }: SetupServerOptions & InterpolateOptions) => {
    const interpolate = createInterpolate({
      locale: getLocale(),
      components,
      ...interpolateOptions
    })
    const tx = createTx<ReactNode>({
      loader,
      getLocale,
      render: props => {
        return (
          <Suspense>
            {/* @ts-ignore */}
            <Text {...props} interpolate={interpolate} />
          </Suspense>
        )
      }
    })

    return {
      tx
    }
  }

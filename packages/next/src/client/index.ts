import type { Tx } from '@rewordlabs/formatter'
import type { TxReactOptions } from '@rewordlabs/react'
import {
  setupClient as setup,
  type SetupClientOptions
} from '@rewordlabs/react/client'
import type { ReactNode } from 'react'

export const setupClient = (
  options: SetupClientOptions
): {
  tx: Tx<ReactNode, TxReactOptions>
} => {
  return setup(options)
}

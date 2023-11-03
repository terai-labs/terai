import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { setup$ } from './setup'

enableReactUse()

export const useLocale = () => setup$.locale.use()

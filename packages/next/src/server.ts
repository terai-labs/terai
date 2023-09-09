import { createSetupServer } from '@rewordlabs/react/server'
import { getLocaleCache } from './get-locale-cache'

export const setupServer = createSetupServer({
  getLocale: async () => getLocaleCache()
})

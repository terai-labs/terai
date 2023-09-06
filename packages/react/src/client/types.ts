// Types
import type { Observable } from '@legendapp/state'
import type { Locale } from '@rewordlabs/types'

export type State = Locale
export type ObservableState = Observable<State>

export type SetupOptions = {
  locale: Locale
  loader: (locale: string, id: string) => Promise<string>
}

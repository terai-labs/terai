import { useContext } from 'react'
import { TeraiContext } from './state'

export const useLocale = () => {
	const context = useContext(TeraiContext)
	if (!context) {
		throw new Error('useLocale must be used within TeraiProvider')
	}
	return context.state.locale
}

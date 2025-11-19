import { useContext } from 'react'
import { TeraiContext } from './state'

export const useDictionaries = () => {
	const context = useContext(TeraiContext)
	if (!context) {
		throw new Error('useDictionaries must be used within TeraiProvider')
	}
	return context.state.dictionaries
}

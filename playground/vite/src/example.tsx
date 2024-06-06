import { useTs } from '@terai/react'

export function App() {
	const { ts } = useTs()

	return <p>{ts`Hello world!`}</p>
}

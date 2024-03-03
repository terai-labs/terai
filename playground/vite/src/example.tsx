import { useTs } from '@terai/vite'

export function App() {
	const { ts } = useTs()

	return <p>{ts`Hello world!`}</p>
}

import { useTs, setLocale } from '@terai/vite'

export default function App() {
	const { ts } = useTs()

	return (
		<div>
			<button type='button' onClick={() => setLocale('es')}>
				es
			</button>
			<button type='button' onClick={() => setLocale('en')}>
				en
			</button>
			<button type='button' onClick={() => setLocale('it')}>
				it
			</button>

			<p>{ts`Terai is a modern localization framework for Javascript`}</p>
		</div>
	)
}

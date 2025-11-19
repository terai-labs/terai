import { useTs, setLocale, useLocale, useFormat } from '@terai/react'

export default function App() {
	const { ts } = useTs()
	const locale = useLocale()
	const date = new Date()
	const format = useFormat()

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<div style={{ display: 'flex', gap: 16 }}>
				<Button locale='es-ES' />
				<Button locale='en-GB' />
				<Button locale='fr-FR' />
				<Button locale='de-DE' />
				<Button locale='ja-JP' />
			</div>

			<p>{ts`Terai is a modern localization framework for ${locale}`}</p>

			<p>{format.date(date, { dateStyle: 'long' })}</p>
		</div>
	)
}

function Button({ locale }: { locale: string }) {
	return (
		<button
			type='button'
			onClick={() => setLocale(locale)}
			style={{
				padding: '8px 16px',
				borderRadius: '8px',
				border: '1px solid white',
				background: 'none',
				color: 'inherit',
				cursor: 'pointer'
			}}
		>
			{locale}
		</button>
	)
}

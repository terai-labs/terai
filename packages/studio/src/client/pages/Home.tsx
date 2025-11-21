import { useState, useEffect } from 'react'
import { TranslationTable } from '../components/TranslationTable'
import type { StudioData } from '../types'

export function Home() {
	const [data, setData] = useState<StudioData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/data')
				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.error || 'Failed to fetch data')
				}
				const result = await response.json()
				setData(result)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return (
			<div className='loading'>
				<div className='spinner' />
				<p>Loading translations...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className='error'>
				<h2>Error</h2>
				<p>{error}</p>
				<p className='hint'>
					Make sure you have run <code>terai extract</code> first.
				</p>
			</div>
		)
	}

	if (!data || data.messages.length === 0) {
		return (
			<div className='empty'>
				<h2>No messages found</h2>
				<p>
					Run <code>terai extract</code> to extract messages from your source
					code.
				</p>
			</div>
		)
	}

	return (
		<div className='home'>
			<div className='stats'>
				<div className='stat'>
					<span className='stat-value'>{data.messages.length}</span>
					<span className='stat-label'>Messages</span>
				</div>
				<div className='stat'>
					<span className='stat-value'>{data.outLocales.length}</span>
					<span className='stat-label'>Locales</span>
				</div>
				<div className='stat'>
					<span className='stat-value'>{data.projectLocale}</span>
					<span className='stat-label'>Project Locale</span>
				</div>
			</div>
			<TranslationTable data={data} />
		</div>
	)
}

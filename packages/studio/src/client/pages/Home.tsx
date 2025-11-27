import { useState, useEffect, useMemo, useCallback } from 'react'
import { TranslationTable } from '../components/TranslationTable'
import type { StudioData } from '../types'

type FilterMode = 'all' | 'missing' | 'translated'

export function Home() {
	const [data, setData] = useState<StudioData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterMode, setFilterMode] = useState<FilterMode>('all')
	const [selectedLocale, setSelectedLocale] = useState<string>('all')

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch('/api/data')
			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to fetch data')
			}
			const result = await response.json()
			setData(result)
			setError(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleRefresh = useCallback(() => {
		setLoading(true)
		fetchData()
	}, [fetchData])

	const filteredMessages = useMemo(() => {
		if (!data) return []

		let messages = data.messages

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			messages = messages.filter(
				(msg) =>
					msg.value.toLowerCase().includes(query) ||
					msg.id.toLowerCase().includes(query) ||
					msg.files.some((f) => f.toLowerCase().includes(query)) ||
					msg.context.toLowerCase().includes(query) ||
					Object.values(msg.translations).some((t) =>
						t.toLowerCase().includes(query)
					)
			)
		}

		// Apply translation status filter
		if (filterMode !== 'all') {
			const targetLocales =
				selectedLocale === 'all'
					? data.outLocales.filter((l) => l !== data.projectLocale)
					: [selectedLocale]

			messages = messages.filter((msg) => {
				const hasMissing = targetLocales.some((l) => !msg.translations[l])
				return filterMode === 'missing' ? hasMissing : !hasMissing
			})
		}

		return messages
	}, [data, searchQuery, filterMode, selectedLocale])

	if (loading && !data) {
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
				<button type='button' className='btn' onClick={handleRefresh}>
					Try Again
				</button>
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

	const targetLocales = data.outLocales.filter((l) => l !== data.projectLocale)

	return (
		<div className='home'>
			<div className='stats-row'>
				<div className='stats'>
					<div className='stat'>
						<span className='stat-value'>{data.stats.totalMessages}</span>
						<span className='stat-label'>Messages</span>
					</div>
					<div className='stat'>
						<span className='stat-value'>{targetLocales.length}</span>
						<span className='stat-label'>Target Locales</span>
					</div>
					<div className='stat'>
						<span className='stat-value coverage'>
							{data.stats.coveragePercentage}%
						</span>
						<span className='stat-label'>Coverage</span>
					</div>
					<div className='stat'>
						<span className='stat-value missing'>
							{data.stats.missingTranslations}
						</span>
						<span className='stat-label'>Missing</span>
					</div>
				</div>
				<button
					type='button'
					className='btn btn-refresh'
					onClick={handleRefresh}
					disabled={loading}
				>
					{loading ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>

			<div className='locale-coverage'>
				{targetLocales.map((locale) => {
					const stats = data.stats.byLocale[locale]
					return (
						<div key={locale} className='locale-stat'>
							<span className='locale-name'>{locale}</span>
							<div className='progress-bar'>
								<div
									className='progress-fill'
									style={{ width: `${stats?.percentage || 0}%` }}
								/>
							</div>
							<span className='locale-percentage'>
								{stats?.percentage || 0}%
							</span>
						</div>
					)
				})}
			</div>

			<div className='toolbar'>
				<div className='search-box'>
					<input
						type='text'
						placeholder='Search messages, translations, files...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='search-input'
					/>
					{searchQuery && (
						<button
							type='button'
							className='clear-btn'
							onClick={() => setSearchQuery('')}
						>
							Clear
						</button>
					)}
				</div>

				<div className='filters'>
					<select
						value={filterMode}
						onChange={(e) => setFilterMode(e.target.value as FilterMode)}
						className='filter-select'
					>
						<option value='all'>All messages</option>
						<option value='missing'>Missing translations</option>
						<option value='translated'>Fully translated</option>
					</select>

					{filterMode !== 'all' && (
						<select
							value={selectedLocale}
							onChange={(e) => setSelectedLocale(e.target.value)}
							className='filter-select'
						>
							<option value='all'>All locales</option>
							{targetLocales.map((locale) => (
								<option key={locale} value={locale}>
									{locale}
								</option>
							))}
						</select>
					)}
				</div>
			</div>

			{filteredMessages.length === 0 ? (
				<div className='no-results'>
					<p>No messages match your filters.</p>
					<button
						type='button'
						className='btn'
						onClick={() => {
							setSearchQuery('')
							setFilterMode('all')
						}}
					>
						Clear Filters
					</button>
				</div>
			) : (
				<>
					<div className='results-count'>
						Showing {filteredMessages.length} of {data.messages.length} messages
					</div>
					<TranslationTable data={{ ...data, messages: filteredMessages }} />
				</>
			)}
		</div>
	)
}

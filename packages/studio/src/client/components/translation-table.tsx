import { useCallback } from 'react'
import type { StudioData, StudioMessage } from '../types'

type TranslationTableProps = {
	data: StudioData
}

function CopyButton({ text, label }: { text: string; label: string }) {
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text)
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement('textarea')
			textarea.value = text
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
		}
	}, [text])

	return (
		<button
			type='button'
			className='copy-btn'
			onClick={handleCopy}
			title={`Copy ${label}`}
		>
			Copy
		</button>
	)
}

function MessageRow({
	message,
	localeColumns,
	projectLocale
}: {
	message: StudioMessage
	localeColumns: string[]
	projectLocale: string
}) {
	const sourceTranslation = message.translations[projectLocale] || message.value

	return (
		<tr>
			<td className='col-source'>
				<div className='message-cell'>
					<div className='message-value'>{message.value}</div>
					<div className='message-meta'>
						<span className='message-id' title={message.id}>
							{message.id}
						</span>
						<CopyButton text={message.id} label='ID' />
					</div>
				</div>
			</td>
			<td className='col-locations'>
				{message.files.map((file, idx) => (
					<div key={idx} className='file-path' title={file}>
						{file}
					</div>
				))}
			</td>
			<td className='col-chunks'>
				{message.chunks.map((chunk, idx) => (
					<span key={idx} className='chunk-badge'>
						{chunk}
					</span>
				))}
			</td>
			<td className='col-context'>
				{message.context || <span className='empty-value'>-</span>}
			</td>
			{localeColumns.map((locale) => {
				const translation = message.translations[locale]
				const isMissing = !translation
				const isDifferent = translation && translation !== sourceTranslation

				return (
					<td
						key={locale}
						className={`col-locale ${isMissing ? 'is-missing' : ''}`}
					>
						{translation ? (
							<div className='translation-cell'>
								<div
									className={`translation ${isDifferent ? '' : 'same-as-source'}`}
								>
									{translation}
								</div>
								<CopyButton text={translation} label={locale} />
							</div>
						) : (
							<span className='missing-translation'>Missing</span>
						)}
					</td>
				)
			})}
		</tr>
	)
}

export function TranslationTable({ data }: TranslationTableProps) {
	const { messages, outLocales, projectLocale, stats } = data

	// Get all locales for columns (excluding project locale)
	const localeColumns = outLocales.filter((l) => l !== projectLocale)

	if (messages.length === 0) {
		return null
	}

	return (
		<div className='table-container'>
			<table className='translation-table'>
				<thead>
					<tr>
						<th className='col-source sticky-col'>Source Message</th>
						<th className='col-locations'>Locations</th>
						<th className='col-chunks'>Chunks</th>
						<th className='col-context'>Context</th>
						{localeColumns.map((locale) => {
							const localeStats = stats?.byLocale?.[locale]
							return (
								<th key={locale} className='col-locale'>
									<div className='locale-header'>
										<span className='locale-name'>{locale}</span>
										{localeStats && (
											<span
												className={`locale-badge ${localeStats.percentage === 100 ? 'complete' : 'partial'}`}
											>
												{localeStats.percentage}%
											</span>
										)}
									</div>
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody>
					{messages.map((message) => (
						<MessageRow
							key={message.id}
							message={message}
							localeColumns={localeColumns}
							projectLocale={projectLocale}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}

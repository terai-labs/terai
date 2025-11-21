import type { StudioData } from '../types'

type TranslationTableProps = {
	data: StudioData
}

export function TranslationTable({ data }: TranslationTableProps) {
	const { messages, outLocales, projectLocale } = data

	// Get all locales for columns (excluding project locale from outLocales if duplicate)
	const localeColumns = outLocales.filter((l) => l !== projectLocale)

	return (
		<div className='table-container'>
			<table className='translation-table'>
				<thead>
					<tr>
						<th className='col-source'>Source Message</th>
						<th className='col-locations'>Locations</th>
						<th className='col-chunks'>Chunks</th>
						<th className='col-context'>Context</th>
						{localeColumns.map((locale) => (
							<th key={locale} className='col-locale'>
								{locale}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{messages.map((message) => (
						<tr key={message.id}>
							<td className='col-source'>
								<div className='message-value'>{message.value}</div>
								<div className='message-id'>ID: {message.id}</div>
							</td>
							<td className='col-locations'>
								{message.files.map((file, idx) => (
									<div key={idx} className='file-path'>
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
							{localeColumns.map((locale) => (
								<td key={locale} className='col-locale'>
									{message.translations[locale] ? (
										<div className='translation'>
											{message.translations[locale]}
										</div>
									) : (
										<span className='missing-translation'>Missing</span>
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

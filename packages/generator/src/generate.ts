// Dependencies
import { runtime } from '@terai/runtime'
import { stringify } from '@terai/utils'

// Types
import type { Config, Locale, Dictionaries } from '@terai/types'

type GenerateOptions = {
	cwd: string
	locale: Locale
	dictionaries: Dictionaries
} & Pick<Config, 'outDir'>

export async function generate({
	dictionaries,
	locale,
	cwd,
	outDir
}: GenerateOptions) {
	const folderPath = runtime.path.resolve(cwd, outDir, locale)
	const output = []

	for (const id in dictionaries) {
		const fileDir = runtime.path.resolve(folderPath, `${id}.json`)
		const fileContent = dictionaries[id]
		const idOutput = stringify(fileContent)

		runtime.fs.write(fileDir, idOutput)

		output.push(idOutput)
	}

	return output
}

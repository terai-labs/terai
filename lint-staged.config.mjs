export default {
	'*.{ts,tsx,js,jsx,css,html,json}': [
		'pnpm biome lint --write --verbose --staged',
		'pnpm biome format --write --verbose --staged'
	],
	'*.{ts,tsx}': 'bash -c tsc --noEmit'
}

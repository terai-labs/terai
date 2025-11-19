import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'

import { setupTerai, useTs } from '@terai/react-native'
import type { Dictionary } from '@terai/dev'

setupTerai({
	defaultLocale: 'en-US',
	loader: (locale: string) => localeMap[locale]
})

const localeMap: Record<string, Promise<Dictionary>> = {
	'en-US': import('../locale/en-US/en-US.json').then((mod) => mod.default),
	'es-ES': import('../locale/es-ES/es-ES.json').then((mod) => mod.default),
	'fr-FR': import('../locale/fr-FR/fr-FR.json').then((mod) => mod.default),
	'de-DE': import('../locale/de-DE/de-DE.json').then((mod) => mod.default),
	'ja-JP': import('../locale/ja-JP/ja-JP.json').then((mod) => mod.default)
}

export const unstable_settings = {
	anchor: '(tabs)'
}

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const { ts } = useTs()
	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen
					name='modal'
					options={{ presentation: 'modal', title: ts`Modal` }}
				/>
			</Stack>
			<StatusBar style='auto' />
		</ThemeProvider>
	)
}

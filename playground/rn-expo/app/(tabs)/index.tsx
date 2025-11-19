import { Image } from 'expo-image'
import { Platform, StyleSheet, Button as RNButton, View } from 'react-native'

import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Link } from 'expo-router'
import { useTs } from '@terai/react-native'
import { setLocale, useLocale, useFormat } from '@terai/react-native'

export default function HomeScreen() {
	const { ts } = useTs()
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={
				<Image
					source={require('@/assets/images/partial-react-logo.png')}
					style={styles.reactLogo}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>{ts`Welcome!`}</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>{ts`Step 1: Try it`}</ThemedText>
				<ThemedText>
					{ts`Edit app/(tabs)/index.tsx to see changes. Press`}
					<ThemedText type='defaultSemiBold'>{ts`cmd + d`}</ThemedText>
					{ts`to open developer tools.`}
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<Link href='/modal'>
					<Link.Trigger>
						<ThemedText type='subtitle'>{ts`Step 2: Explore`}</ThemedText>
					</Link.Trigger>
					<Link.Preview />
					<Link.Menu>
						<Link.MenuAction
							title={ts`Action`}
							icon='cube'
							onPress={() => alert('Action pressed')}
						/>
						<Link.MenuAction
							title={ts`Share`}
							icon='square.and.arrow.up'
							onPress={() => alert(ts`Share pressed`)}
						/>
						<Link.Menu title={ts`More`} icon='ellipsis'>
							<Link.MenuAction
								title={ts`Delete`}
								icon='trash'
								destructive
								onPress={() => alert(ts`Delete pressed`)}
							/>
						</Link.Menu>
					</Link.Menu>
				</Link>

				<ThemedText>
					{ts`Tap the Explore tab to learn more about what's included in this starter app.`}
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>Step 3: Get a fresh start</ThemedText>
				<ThemedText>
					{`When you're ready, run `}
					<ThemedText type='defaultSemiBold'>npm run reset-project</ThemedText>{' '}
					to get a fresh <ThemedText type='defaultSemiBold'>app</ThemedText>{' '}
					directory. This will move the current{' '}
					<ThemedText type='defaultSemiBold'>app</ThemedText> to{' '}
					<ThemedText type='defaultSemiBold'>app-example</ThemedText>.
				</ThemedText>
			</ThemedView>
			<LocaleSwitcher />
		</ParallaxScrollView>
	)
}

function LocaleSwitcher() {
	const { ts } = useTs()
	const locale = useLocale()
	const date = new Date()
	const format = useFormat()

	return (
		<View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<View style={{ display: 'flex', gap: 16, flexDirection: 'row' }}>
				<Button locale='es-ES' />
				<Button locale='en-GB' />
				<Button locale='fr-FR' />
				<Button locale='de-DE' />
				<Button locale='ja-JP' />
			</View>

			<ThemedText>{ts`Terai is a modern localization framework for ${locale}`}</ThemedText>

			<ThemedText>{format.date(date, { dateStyle: 'long' })}</ThemedText>
		</View>
	)
}

function Button({ locale }: { locale: string }) {
	return <RNButton title={locale} onPress={() => setLocale(locale)} />
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute'
	}
})

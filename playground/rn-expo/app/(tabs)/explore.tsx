import { Image } from 'expo-image'
import { Platform, StyleSheet } from 'react-native'

import { Collapsible } from '@/components/ui/collapsible'
import { ExternalLink } from '@/components/external-link'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'
import { useTs } from '@terai/react-native'

export default function TabTwoScreen() {
	const { ts } = useTs()

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			headerImage={
				<IconSymbol
					size={310}
					color='#808080'
					name='chevron.left.forwardslash.chevron.right'
					style={styles.headerImage}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText
					type='title'
					style={{
						fontFamily: Fonts.rounded
					}}
				>
					{ts`Explore`}
				</ThemedText>
			</ThemedView>
			<ThemedText>
				{ts`This app includes example code to help you get started.`}
			</ThemedText>
			<Collapsible title='File-based routing'>
				<ThemedText>
					{ts`This app has two screens:`}{' '}
					<ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText>{' '}
					and{' '}
					<ThemedText type='defaultSemiBold'>app/(tabs)/explore.tsx</ThemedText>
				</ThemedText>
				<ThemedText>{ts`The layout file in app/(tabs)/_layout.tsx sets up the tab navigator.`}</ThemedText>
				<ExternalLink href='https://docs.expo.dev/router/introduction'>
					<ThemedText type='link'>{ts`Learn more`}</ThemedText>
				</ExternalLink>
			</Collapsible>
			<Collapsible title='Android, iOS, and web support'>
				<ThemedText>
					{ts`You can open this project on Android, iOS, and the web. To open the
					web version, press w in the terminal running this project.`}
				</ThemedText>
			</Collapsible>
			<Collapsible title='Images'>
				<ThemedText>{ts`For static images, you can use the @2x and @3x suffixes to provide files for different screen densities`}</ThemedText>
				<Image
					source={require('@/assets/images/react-logo.png')}
					style={{ width: 100, height: 100, alignSelf: 'center' }}
				/>
				<ExternalLink href='https://reactnative.dev/docs/images'>
					<ThemedText type='link'>{ts`Learn more`}</ThemedText>
				</ExternalLink>
			</Collapsible>
			<Collapsible title='Light and dark mode components'>
				<ThemedText>
					{ts`This template has light and dark mode support. The useColorScheme() hook`}
					<ThemedText type='defaultSemiBold'>{ts`useColorScheme()`}</ThemedText>
					{ts`lets you inspect what the user's current color scheme is, and so you can adjust UI colors accordingly.`}
				</ThemedText>
				<ExternalLink href='https://docs.expo.dev/develop/user-interface/color-themes/'>
					<ThemedText type='link'>{ts`Learn more`}</ThemedText>
				</ExternalLink>
			</Collapsible>
			<Collapsible title='Animations'>
				<ThemedText>
					{ts`This template includes an example of an animated component. The`}
					<ThemedText type='defaultSemiBold'>
						{ts`components/HelloWave.tsx`}
					</ThemedText>{' '}
					{ts`component uses the powerful react-native-reanimated library to create a waving hand animation.`}
				</ThemedText>
				{Platform.select({
					ios: (
						<ThemedText>
							{ts`The`}
							<ThemedText type='defaultSemiBold'>
								{ts`components/ParallaxScrollView.tsx`}
							</ThemedText>{' '}
							{ts`component provides a parallax effect for the header image.`}
						</ThemedText>
					)
				})}
			</Collapsible>
		</ParallaxScrollView>
	)
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute'
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8
	}
})

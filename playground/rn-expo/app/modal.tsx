import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useTs } from '@terai/react-native'

export default function ModalScreen() {
	const { ts } = useTs()
	return (
		<ThemedView style={styles.container}>
			<ThemedText type='title'>{ts`This is a modal`}</ThemedText>
			<Link href='/' dismissTo style={styles.link}>
				<ThemedText type='link'>{ts`Go to home screen`}</ThemedText>
			</Link>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	link: {
		marginTop: 15,
		paddingVertical: 15
	}
})

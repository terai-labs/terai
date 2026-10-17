export type InterpolateProps = {
	message: string
	variables: any[]
}

export function interpolate({ message, variables }: InterpolateProps) {
	let index = 0

	const messageWithVars = message.replace(/\${(\w+)}/g, () => {
		const variable = variables[index]
		index++

		if (variable == null) return ''

		return variable
	})

	return messageWithVars
}

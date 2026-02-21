export type InterpolateProps = {
	message: string
	variables: any[]
}

const VAR_PATTERN = /\${(\w+)}/g

export function interpolate({ message, variables }: InterpolateProps) {
	let index = 0

	const messageWithVars = message.replace(VAR_PATTERN, () => {
		const variable = variables[index]
		index++

		if (!variable) return null

		return variable
	})

	return messageWithVars
}

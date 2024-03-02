// Dependencies
import { joinTemplateStrings, prepareMessage, toHash } from '@terai/utils'

// Types
import type { DynamicValue } from '@terai/formatter'

export type TsRenderer<R, E> = (options: TsRenderProps & E) => R

export type TsRenderProps = TsOptions & {
	id: string
	rawMessage: string
	variables: DynamicValue[]
}

export type TsOptions = {
	context?: string
}

export interface Ts<R, E> {
	(strings: TemplateStringsArray, ...variables: DynamicValue[]): R
	(options: TsOptions & E): Ts<R, E>
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
	return v?.raw && v?.length
}

export function createTs<
	R,
	E extends Record<string, unknown> = Record<string, never>
>(renderer: TsRenderer<R, E>, opts?: E): Ts<R, E> {
	function ts(
		stringsOrOptions: TemplateStringsArray,
		...variables: DynamicValue[]
	): R
	function ts(stringsOrOptions: E): Ts<R, E>
	function ts(
		stringsOrOptions: TemplateStringsArray | E,
		...variables: DynamicValue[]
	): R | Ts<R, E> {
		if (isTemplateStringsArray(stringsOrOptions)) {
			const strings = stringsOrOptions
			const rawMessage = prepareMessage(joinTemplateStrings(strings.raw))
			const id = toHash(rawMessage)
			const args = {
				...opts,
				id,
				rawMessage,
				variables
			} as E & TsRenderProps

			return renderer(args)
		}

		return createTs<R, E>(renderer, stringsOrOptions)
	}

	return ts
}

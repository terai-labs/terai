import { describe, expect, test } from 'vitest'
import { interpolate } from '../src/interpolate'

describe('interpolate', () => {
	test('replaces variables in message', () => {
		expect(
			interpolate({ message: 'Hello ${var}!', variables: ['world'] })
		).toBe('Hello world!')
	})

	test('replaces multiple variables', () => {
		expect(
			interpolate({
				message: '${var} has ${var} items',
				variables: ['Cart', 5]
			})
		).toBe('Cart has 5 items')
	})

	test('empty string variables render as empty, not "null"', () => {
		expect(
			interpolate({
				message: 'Searching workout history${var}...',
				variables: ['']
			})
		).toBe('Searching workout history...')
	})

	test('zero renders as "0", not "null"', () => {
		expect(interpolate({ message: 'Count: ${var}', variables: [0] })).toBe(
			'Count: 0'
		)
	})

	test('false renders as "false", not "null"', () => {
		expect(interpolate({ message: 'Value: ${var}', variables: [false] })).toBe(
			'Value: false'
		)
	})

	test('null and undefined variables render as empty string', () => {
		expect(
			interpolate({ message: '${var} ${var}', variables: [null, undefined] })
		).toBe(' ')
	})
})

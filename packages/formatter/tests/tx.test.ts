import { createTx } from '../src/tx'
import { expect, test, describe } from 'vitest'

const tx = createTx({
  getLocale: () => 'en',
  getDictionary: () => ({
    test: 'test'
  })
})

describe('tx', () => {
  describe('should translate simple strings', () => {
    test('should return a message', () => {
      const message = tx`Hello world!`

      expect(message).toBeDefined()
    })
  })
  describe('should admit an argument first', () => {
    test('should return a message', () => {
      const message = tx({ context: 'test' })`Hello world!`

      expect(message).toBeDefined()
    })
  })
  describe('should recognize variables', () => {
    test('should return a message', () => {
      const message = tx({ context: 'test' })`Hello ${'name'}!`
      console.log(message)

      expect(message).toBeDefined()
    })
  })

  describe('should translate messages with numbers', () => {
    test('when a simple number is passed it should return the message with the value', () => {
      const count = 1000
      const message = tx`You have ${count} messages!`

      expect(message).toBe('You have 1,000 messages!')
    })
    test('when a number object is passed it should return the message applying the options', () => {
      const count = 100000
      const message = tx`We received ${{
        format: 'number',
        value: count,
        notation: 'compact'
      }} dollars!`

      expect(message).toBe('We received 100K dollars!')
    })
  })

  describe('should translate messages with dates', () => {
    test('when a simple date is passed it should return the message with the formatted value', () => {
      const date = new Date(1)
      const message = tx`On ${date}, we will go to the beach`

      expect(message).toBe('On 1/1/1970, we will go to the beach')
    })

    test('when a number object is passed it should return the message applying the options', () => {
      const date = new Date(1)
      const message = tx`We are not on ${{
        format: 'date',
        value: date,
        weekday: 'long'
      }}!`

      expect(message).toBe('We are not on Thursday!')
    })
  })
})

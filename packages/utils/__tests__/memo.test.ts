import { describe, expect, test, vi } from 'vitest'
import { memo } from '../src'

describe('memo', () => {
  test('should be called only once when using the same arguments', () => {
    const fn = vi.fn((arg: number) => arg)
    const memoizedFn = memo(fn)

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(1)

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should return the cached result for the same arguments', () => {
    const fn = (arg: number) => arg
    const memoizedFn = memo(fn)

    const result1 = memoizedFn(1)
    const result2 = memoizedFn(1)

    expect(result1).toBe(result2)
  })

  test('should return a new result for different arguments', () => {
    const fn = (arg: number) => arg
    const memoizedFn = memo(fn)

    const result1 = memoizedFn(1)
    const result2 = memoizedFn(2)

    expect(result1).not.toBe(result2)
  })
})

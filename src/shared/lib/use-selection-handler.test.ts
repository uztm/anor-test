import { renderHook } from './tests/test-utils'
import { useSelectionHandler } from './use-selection-handler'
import { act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Use selection handler hook', () => {
  it('should check onAddKey function', () => {
    const { result } = renderHook(useSelectionHandler)

    expect(result.current.selections).toStrictEqual([])

    act(() => {
      result.current.onAddKey('added key')
      result.current.onAddKey('some other key')
    })

    expect(result.current.selections).toStrictEqual([
      'added key',
      'some other key',
    ])
  })

  it('should check onRemoveKey function', () => {
    const { result } = renderHook(useSelectionHandler)

    act(() => {
      result.current.onAddKey('key to remove')
      result.current.onAddKey('some other key')
    })

    act(() => {
      result.current.onRemoveKey('key to remove')
    })

    expect(result.current.selections).toHaveLength(1)
  })

  it('should check hasKey function', () => {
    const { result } = renderHook(useSelectionHandler)

    act(() => {
      result.current.onAddKey('key to find')
    })

    act(() => {
      expect(result.current.hasKey('key to find')).toBeTruthy()
      expect(result.current.hasKey('some other key')).not.toBeTruthy()
    })
  })

  it('should check resetSelections', () => {
    const { result } = renderHook(useSelectionHandler)

    act(() => {
      result.current.onAddKey('some key')
    })

    act(() => {
      result.current.resetSelections()
    })

    expect(result.current.selections).toHaveLength(0)
  })
})

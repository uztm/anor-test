import type { PageableRequestParams } from '../types'
import { renderHook } from './tests/test-utils'
import { useSearchRequestParams } from './use-search-request-params'
import { act } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('Use search request params hook', () => {
  afterEach(() => {
    const { result } = renderHook(() => useSearchRequestParams())
    act(() => {
      result.current.resetSearchParams()
    })
  })
  it('should check setSearchParams method', () => {
    const { result } = renderHook(() =>
      useSearchRequestParams<PageableRequestParams>(),
    )

    expect(result.current.searchParams).toStrictEqual({})

    act(() => {
      result.current.setSearchParams({ key: 'limit', value: '20' })
    })

    expect(result.current.searchParams).toStrictEqual({ limit: '20' })
  })

  it('should check resetSearchParams method', () => {
    const { result } = renderHook(() =>
      useSearchRequestParams<PageableRequestParams>(),
    )

    act(() => {
      result.current.setSearchParams({ key: 'q', value: 'test' })
    })

    expect(result.current.searchParams).toStrictEqual({ q: 'test' })

    act(() => {
      result.current.resetSearchParams()
    })

    expect(result.current.searchParams).toStrictEqual({})
  })

  it('should check getDefaultParams method', () => {
    const { result } = renderHook(() =>
      useSearchRequestParams<PageableRequestParams>({
        defaultParams: { order: 'asc' },
      }),
    )

    let params: Partial<PageableRequestParams> = {}

    act(() => {
      params = result.current.getDefaultSearchParams()
    })

    expect(params).toStrictEqual({ order: 'asc' })
  })
})

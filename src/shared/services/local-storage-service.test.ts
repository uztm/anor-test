import { localStorageService } from './local-storage-service'
import { beforeEach, describe, expect, it } from 'vitest'

const { get, set, remove } = localStorageService

describe('Local Storage service', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('should check set method with some value', () => {
    set('access_token', 'some value')

    expect(localStorage.getItem('access_token')).toBe('some value')
  })
  it('should check get method with some value', () => {
    localStorage.setItem('access_token', 'some value')

    const value = get('access_token')

    expect(value).toBe('some value')
    expect(value).not.toBeNull()
  })
  it('should check remove method', () => {
    localStorage.setItem('access_token', 'something to remove')

    expect(localStorage.getItem('access_token')).toBeTruthy()

    remove('access_token')

    expect(localStorage.getItem('access_token')).toBeNull()
  })
})

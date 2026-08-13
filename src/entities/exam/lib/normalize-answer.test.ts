import { isOpenAnswerCorrect, normalizeAnswer } from './normalize-answer'
import { describe, expect, it } from 'vitest'

describe('normalizeAnswer', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeAnswer('   virtual dom   ')).toBe('virtual dom')
  })

  it('collapses inner whitespace, including tabs and newlines', () => {
    expect(normalizeAnswer('virtual \t\n  dom')).toBe('virtual dom')
  })

  it('lowercases the answer', () => {
    expect(normalizeAnswer('Virtual DOM')).toBe('virtual dom')
  })

  it('turns punctuation into a word separator', () => {
    expect(normalizeAnswer('virtual-dom')).toBe('virtual dom')
    expect(normalizeAnswer('virtual dom.')).toBe('virtual dom')
    expect(normalizeAnswer('«virtual dom»')).toBe('virtual dom')
    expect(normalizeAnswer('virtual_dom')).toBe('virtual dom')
  })

  it('normalises every apostrophe variant to a plain quote', () => {
    const expected = "o'zbekiston"

    expect(normalizeAnswer('oʻzbekiston')).toBe(expected)
    expect(normalizeAnswer('oʼzbekiston')).toBe(expected)
    expect(normalizeAnswer('o’zbekiston')).toBe(expected)
    expect(normalizeAnswer('o‘zbekiston')).toBe(expected)
    expect(normalizeAnswer('o`zbekiston')).toBe(expected)
    expect(normalizeAnswer("O'ZBEKISTON")).toBe(expected)
  })

  it('keeps Cyrillic answers intact', () => {
    expect(normalizeAnswer('  Виртуальный  DOM ')).toBe('виртуальный dom')
  })

  it('returns an empty string for blank input', () => {
    expect(normalizeAnswer('')).toBe('')
    expect(normalizeAnswer('   ')).toBe('')
    expect(normalizeAnswer('...')).toBe('')
  })

  it('is idempotent', () => {
    const once = normalizeAnswer('  Virtual—DOM! ')
    expect(normalizeAnswer(once)).toBe(once)
  })
})

describe('isOpenAnswerCorrect', () => {
  const accepted = [
    'virtual dom',
    'virtual-dom',
    'virtual document object model',
  ]

  it('accepts an exact match', () => {
    expect(isOpenAnswerCorrect('virtual dom', accepted)).toBe(true)
  })

  it('accepts a match that only differs by case, spacing or punctuation', () => {
    expect(isOpenAnswerCorrect('  Virtual   DOM. ', accepted)).toBe(true)
    expect(isOpenAnswerCorrect('VIRTUAL-DOM', accepted)).toBe(true)
  })

  it('accepts an alternative accepted answer', () => {
    expect(isOpenAnswerCorrect('Virtual Document Object Model', accepted)).toBe(
      true,
    )
  })

  it('rejects a wrong answer', () => {
    expect(isOpenAnswerCorrect('shadow dom', accepted)).toBe(false)
  })

  it('rejects an unanswered question', () => {
    expect(isOpenAnswerCorrect(undefined, accepted)).toBe(false)
    expect(isOpenAnswerCorrect('', accepted)).toBe(false)
    expect(isOpenAnswerCorrect('   ', accepted)).toBe(false)
  })

  it('rejects everything when there are no accepted answers', () => {
    expect(isOpenAnswerCorrect('virtual dom', [])).toBe(false)
  })

  it('normalises the accepted answers too', () => {
    expect(isOpenAnswerCorrect("o'zbekiston", ['Oʻzbekiston'])).toBe(true)
  })
})

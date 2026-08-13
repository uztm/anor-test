/**
 * Apostrophe-like characters that must all collapse to a plain `'`.
 * Covers the Uzbek modifier letters (ʻ ʼ), typographic quotes (‘ ’),
 * the backtick/acute pair and the prime symbol.
 */
const APOSTROPHE_PATTERN = /[ʻʼ‘’`´′']/gu

const APOSTROPHE = "'"

/** Every Unicode punctuation and symbol character. */
const PUNCTUATION_PATTERN = /[\p{P}\p{S}]/gu

const WHITESPACE_PATTERN = /\s+/gu

/** Punctuation becomes a space so that `virtual-dom` matches `virtual dom`. */
const replacePunctuation = (char: string): string =>
  char === APOSTROPHE ? APOSTROPHE : ' '

/**
 * Brings a free-text answer to a comparable form:
 * NFKC-normalised, lowercased, apostrophe variants folded to `'`,
 * other punctuation replaced by a space, whitespace collapsed and trimmed.
 */
export const normalizeAnswer = (value: string): string =>
  value
    .normalize('NFKC')
    .toLowerCase()
    .replace(APOSTROPHE_PATTERN, APOSTROPHE)
    .replace(PUNCTUATION_PATTERN, replacePunctuation)
    .replace(WHITESPACE_PATTERN, ' ')
    .trim()

/**
 * An open answer counts as correct when its normalised form matches any of
 * the accepted answers. An empty answer is never correct.
 */
export const isOpenAnswerCorrect = (
  answer: string | undefined,
  acceptedAnswers: readonly string[],
): boolean => {
  const normalized = normalizeAnswer(answer ?? '')

  if (!normalized) {
    return false
  }

  return acceptedAnswers.some(
    (accepted) => normalizeAnswer(accepted) === normalized,
  )
}

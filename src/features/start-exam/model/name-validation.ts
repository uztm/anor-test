export const NAME_MIN_LENGTH = 3

export const NAME_MAX_LENGTH = 60

/** Latin and Cyrillic letters, spaces, apostrophes and hyphens. */
const NAME_PATTERN = /^[\p{L}\p{M} '’ʻʼ-]+$/u

export type NameError =
  | 'validation.nameRequired'
  | 'validation.nameTooShort'
  | 'validation.nameTooLong'
  | 'validation.nameInvalidChars'
  | null

export const validateParticipantName = (value: string): NameError => {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return 'validation.nameRequired'
  }

  if (trimmed.length < NAME_MIN_LENGTH) {
    return 'validation.nameTooShort'
  }

  if (trimmed.length > NAME_MAX_LENGTH) {
    return 'validation.nameTooLong'
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return 'validation.nameInvalidChars'
  }

  return null
}

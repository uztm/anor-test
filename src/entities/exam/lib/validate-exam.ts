import type {
  ExamConfig,
  ExamDocument,
  ExamLocale,
  OptionId,
} from '../model/types'

const OPTION_IDS: readonly OptionId[] = ['a', 'b', 'c', 'd']

const CHOICE_ORDER_LIMIT = 30

const formatIssue = (issue: string): string => `  - ${issue}`

const formatIssues = (issues: string[]): string =>
  `Exam data is invalid:\n${issues.map(formatIssue).join('\n')}`

export class ExamValidationError extends Error {
  readonly issues: string[]

  constructor(issues: string[]) {
    super(formatIssues(issues))
    this.name = 'ExamValidationError'
    this.issues = issues
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isOptionId = (value: unknown): value is OptionId =>
  OPTION_IDS.includes(value as OptionId)

const validateConfig = (
  value: unknown,
  locale: ExamLocale,
  issues: string[],
): void => {
  if (!isRecord(value)) {
    issues.push(`[${locale}] "config" must be an object`)
    return
  }

  const numericKeys: (keyof ExamConfig)[] = [
    'durationMinutes',
    'totalQuestions',
    'passPercentage',
    'maxViolations',
  ]
  const booleanKeys: (keyof ExamConfig)[] = [
    'shuffleQuestions',
    'shuffleOptions',
  ]

  numericKeys.forEach((key) => {
    if (typeof value[key] !== 'number' || Number.isNaN(value[key])) {
      issues.push(`[${locale}] "config.${key}" must be a number`)
    }
  })

  booleanKeys.forEach((key) => {
    if (typeof value[key] !== 'boolean') {
      issues.push(`[${locale}] "config.${key}" must be a boolean`)
    }
  })
}

const validateChoiceQuestion = (
  question: Record<string, unknown>,
  label: string,
  issues: string[],
): void => {
  if (!isOptionId(question.correctOptionId)) {
    issues.push(`${label} "correctOptionId" must be one of a | b | c | d`)
  }

  if (!Array.isArray(question.options)) {
    issues.push(`${label} "options" must be an array`)
    return
  }

  const ids = question.options.map((option) => {
    if (!isRecord(option)) {
      issues.push(`${label} every option must be an object`)
      return null
    }
    if (!isOptionId(option.id)) {
      issues.push(
        `${label} option id "${String(option.id)}" is not a | b | c | d`,
      )
    }
    if (!isNonEmptyString(option.text)) {
      issues.push(`${label} option "${String(option.id)}" has no text`)
    }
    return option.id
  })

  OPTION_IDS.forEach((optionId) => {
    if (!ids.includes(optionId)) {
      issues.push(`${label} is missing option "${optionId}"`)
    }
  })

  if (
    isOptionId(question.correctOptionId) &&
    !ids.includes(question.correctOptionId)
  ) {
    issues.push(
      `${label} "correctOptionId" points to a missing option "${question.correctOptionId}"`,
    )
  }
}

const validateOpenQuestion = (
  question: Record<string, unknown>,
  label: string,
  issues: string[],
): void => {
  if (
    !Array.isArray(question.acceptedAnswers) ||
    question.acceptedAnswers.length === 0
  ) {
    issues.push(`${label} "acceptedAnswers" must be a non-empty array`)
    return
  }

  question.acceptedAnswers.forEach((accepted) => {
    if (!isNonEmptyString(accepted)) {
      issues.push(`${label} every accepted answer must be a non-empty string`)
    }
  })
}

const validateQuestion = (
  value: unknown,
  index: number,
  locale: ExamLocale,
  issues: string[],
): void => {
  const label = `[${locale}] question #${index + 1}:`

  if (!isRecord(value)) {
    issues.push(`${label} must be an object`)
    return
  }

  if (!isNonEmptyString(value.id)) {
    issues.push(`${label} "id" is required`)
  }

  const expectedOrder = index + 1

  if (value.order !== expectedOrder) {
    issues.push(
      `${label} "order" must be ${expectedOrder}, got ${String(value.order)}`,
    )
  }

  if (typeof value.points !== 'number' || value.points <= 0) {
    issues.push(`${label} "points" must be a positive number`)
  }

  if (!isNonEmptyString(value.prompt)) {
    issues.push(`${label} "prompt" is missing for locale "${locale}"`)
  }

  const expectedType =
    expectedOrder <= CHOICE_ORDER_LIMIT ? 'single_choice' : 'open_text'

  if (value.type !== expectedType) {
    issues.push(
      `${label} "type" must be "${expectedType}" for order ${expectedOrder}, got "${String(value.type)}"`,
    )
    return
  }

  if (expectedType === 'single_choice') {
    validateChoiceQuestion(value, label, issues)
    return
  }

  validateOpenQuestion(value, label, issues)
}

const validateDocument = (
  value: unknown,
  locale: ExamLocale,
  issues: string[],
): void => {
  if (!isRecord(value)) {
    issues.push(`[${locale}] exam file must export an object`)
    return
  }

  if (!isNonEmptyString(value.id)) {
    issues.push(`[${locale}] "id" is required`)
  }

  if (typeof value.version !== 'number') {
    issues.push(`[${locale}] "version" must be a number`)
  }

  validateConfig(value.config, locale, issues)

  if (!Array.isArray(value.questions)) {
    issues.push(`[${locale}] "questions" must be an array`)
    return
  }

  const expectedTotal = isRecord(value.config)
    ? value.config.totalQuestions
    : undefined

  if (
    typeof expectedTotal === 'number' &&
    value.questions.length !== expectedTotal
  ) {
    issues.push(
      `[${locale}] expected ${expectedTotal} questions, got ${value.questions.length}`,
    )
  }

  value.questions.forEach((question, index) => {
    validateQuestion(question, index, locale, issues)
  })
}

/** Fields that must be identical in every locale file. */
const SHARED_QUESTION_KEYS = ['id', 'order', 'type', 'points'] as const

const compareLocales = (
  primary: ExamDocument,
  secondary: ExamDocument,
  issues: string[],
): void => {
  if (primary.id !== secondary.id) {
    issues.push(
      `Exam "id" differs between locales: "${primary.id}" vs "${secondary.id}"`,
    )
  }

  if (primary.version !== secondary.version) {
    issues.push(
      `Exam "version" differs between locales: ${primary.version} vs ${secondary.version}`,
    )
  }

  const configKeys = Object.keys(primary.config) as (keyof ExamConfig)[]

  configKeys.forEach((key) => {
    if (primary.config[key] !== secondary.config[key]) {
      issues.push(
        `"config.${key}" differs between locales: ${String(primary.config[key])} vs ${String(secondary.config[key])}`,
      )
    }
  })

  if (primary.questions.length !== secondary.questions.length) {
    issues.push(
      `Locale files hold a different number of questions: ${primary.questions.length} vs ${secondary.questions.length}`,
    )
    return
  }

  primary.questions.forEach((question, index) => {
    const counterpart = secondary.questions[index]

    SHARED_QUESTION_KEYS.forEach((key) => {
      if (question[key] !== counterpart[key]) {
        issues.push(
          `Question #${index + 1}: "${key}" differs between locales: ${String(question[key])} vs ${String(counterpart[key])}`,
        )
      }
    })

    if (
      question.type === 'single_choice' &&
      counterpart.type === 'single_choice' &&
      question.correctOptionId !== counterpart.correctOptionId
    ) {
      issues.push(
        `Question #${index + 1}: "correctOptionId" differs between locales: ${question.correctOptionId} vs ${counterpart.correctOptionId}`,
      )
    }
  })
}

/**
 * Validates both locale files and asserts they describe the same exam.
 * Throws {@link ExamValidationError} listing every problem found.
 */
export const validateExam = (
  documents: Record<ExamLocale, unknown>,
): Record<ExamLocale, ExamDocument> => {
  const issues: string[] = []
  const locales = Object.keys(documents) as ExamLocale[]

  locales.forEach((locale) => {
    validateDocument(documents[locale], locale, issues)
  })

  if (issues.length > 0) {
    throw new ExamValidationError(issues)
  }

  const validated = documents as Record<ExamLocale, ExamDocument>

  compareLocales(validated.uz, validated.ru, issues)

  if (issues.length > 0) {
    throw new ExamValidationError(issues)
  }

  return validated
}

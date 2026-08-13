import ruExam from '../model/ru/exam.json'
import uzExam from '../model/uz/exam.json'
import { loadExam } from './load-exam'
import { ExamValidationError, validateExam } from './validate-exam'
import { describe, expect, it } from 'vitest'

/** Loose mirror of ExamDocument so tests can corrupt individual fields. */
interface MutableDocument {
  id: string
  version: number
  config: Record<string, unknown>
  questions: Record<string, unknown>[]
}

const clone = (value: unknown): MutableDocument =>
  JSON.parse(JSON.stringify(value)) as MutableDocument

describe('validateExam', () => {
  it('accepts the bundled exam files', () => {
    expect(() => validateExam({ uz: uzExam, ru: ruExam })).not.toThrow()
  })

  it('rejects a wrong question count', () => {
    const uz = clone(uzExam)
    uz.questions.pop()

    expect(() => validateExam({ uz, ru: ruExam })).toThrow(ExamValidationError)
  })

  it('names the locale that is missing a prompt', () => {
    const ru = clone(ruExam)
    ru.questions[4].prompt = ''

    expect(() => validateExam({ uz: uzExam, ru })).toThrow(/\[ru\].*prompt/s)
  })

  it('rejects a question whose type does not match its order', () => {
    const uz = clone(uzExam)
    uz.questions[0].type = 'open_text'

    expect(() => validateExam({ uz, ru: ruExam })).toThrow(/single_choice/)
  })

  it('rejects an answer key that differs between locales', () => {
    const ru = clone(ruExam)
    ru.questions[0].correctOptionId = 'd'

    expect(() => validateExam({ uz: uzExam, ru })).toThrow(/correctOptionId/)
  })

  it('rejects config drift between locales', () => {
    const ru = clone(ruExam)
    ru.config.durationMinutes = 90

    expect(() => validateExam({ uz: uzExam, ru })).toThrow(
      /config.durationMinutes/,
    )
  })

  it('rejects an open question with no accepted answers', () => {
    const uz = clone(uzExam)
    uz.questions[34].acceptedAnswers = []

    expect(() => validateExam({ uz, ru: ruExam })).toThrow(/acceptedAnswers/)
  })

  it('collects every issue in one error', () => {
    const uz = clone(uzExam)
    uz.questions[0].prompt = ''
    uz.questions[1].prompt = ''

    try {
      validateExam({ uz, ru: ruExam })
      expect.unreachable('validateExam should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ExamValidationError)
      expect((error as ExamValidationError).issues.length).toBeGreaterThan(1)
    }
  })
})

describe('loadExam', () => {
  it('merges both locale files into one exam', () => {
    const exam = loadExam()

    expect(exam.id).toBe('demo-exam-2026')
    expect(exam.config.totalQuestions).toBe(35)
    expect(exam.locales.uz.questions).toHaveLength(35)
    expect(exam.locales.ru.questions).toHaveLength(35)
  })

  it('returns the same instance on repeated calls', () => {
    expect(loadExam()).toBe(loadExam())
  })
})

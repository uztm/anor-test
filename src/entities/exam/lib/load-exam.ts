import ruExam from '../model/ru/exam.json'
import type {
  ChoiceQuestion,
  Exam,
  ExamLocale,
  ExamQuestion,
  OpenQuestion,
} from '../model/types'
import uzExam from '../model/uz/exam.json'
import { validateExam } from './validate-exam'

let cached: Exam | null = null

/**
 * Reads both locale files, validates them and merges them into a single
 * {@link Exam}. Throws `ExamValidationError` when the data is malformed —
 * never returns a partially valid exam.
 */
export const loadExam = (): Exam => {
  if (cached) {
    return cached
  }

  const locales = validateExam({ uz: uzExam, ru: ruExam })

  cached = {
    id: locales.uz.id,
    version: locales.uz.version,
    config: locales.uz.config,
    locales,
  }

  return cached
}

export const getQuestions = (exam: Exam, locale: ExamLocale): ExamQuestion[] =>
  exam.locales[locale].questions

export const getQuestionById = (
  exam: Exam,
  locale: ExamLocale,
  questionId: string,
): ExamQuestion | undefined =>
  getQuestions(exam, locale).find((question) => question.id === questionId)

export const isChoiceQuestion = (
  question: ExamQuestion,
): question is ChoiceQuestion => question.type === 'single_choice'

export const isOpenQuestion = (
  question: ExamQuestion,
): question is OpenQuestion => question.type === 'open_text'

/**
 * Accepted answers from every locale, so switching language mid-attempt can
 * never invalidate an answer the participant already typed.
 */
export const getAcceptedAnswers = (
  exam: Exam,
  questionId: string,
): string[] => {
  const locales = Object.keys(exam.locales) as ExamLocale[]

  return locales.flatMap((locale) => {
    const question = getQuestionById(exam, locale, questionId)
    return question && isOpenQuestion(question) ? question.acceptedAnswers : []
  })
}

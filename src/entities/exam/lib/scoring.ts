import type {
  Exam,
  ExamAttempt,
  ExamLocale,
  ExamScore,
  QuestionResult,
} from '../model/types'
import {
  getAcceptedAnswers,
  getQuestionById,
  isChoiceQuestion,
} from './load-exam'
import { isOpenAnswerCorrect } from './normalize-answer'

const ACCEPTED_ANSWER_SEPARATOR = ' / '

const toTrimmedAnswer = (value: string | undefined): string | null => {
  const trimmed = value?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : null
}

const buildQuestionResult = (
  exam: Exam,
  attempt: ExamAttempt,
  locale: ExamLocale,
  questionId: string,
): QuestionResult | null => {
  const question = getQuestionById(exam, locale, questionId)

  if (!question) {
    return null
  }

  const rawAnswer = attempt.answers[questionId]

  if (isChoiceQuestion(question)) {
    const selected = question.options.find((option) => option.id === rawAnswer)
    const correctOption = question.options.find(
      (option) => option.id === question.correctOptionId,
    )
    const isCorrect = rawAnswer === question.correctOptionId

    return {
      questionId,
      order: question.order,
      type: question.type,
      prompt: question.prompt,
      participantAnswer: selected?.text ?? null,
      correctAnswer: correctOption?.text ?? question.correctOptionId,
      isCorrect,
      points: question.points,
      earnedPoints: isCorrect ? question.points : 0,
    }
  }

  const isCorrect = isOpenAnswerCorrect(
    rawAnswer,
    getAcceptedAnswers(exam, questionId),
  )

  return {
    questionId,
    order: question.order,
    type: question.type,
    prompt: question.prompt,
    participantAnswer: toTrimmedAnswer(rawAnswer),
    correctAnswer: question.acceptedAnswers.join(ACCEPTED_ANSWER_SEPARATOR),
    isCorrect,
    points: question.points,
    earnedPoints: isCorrect ? question.points : 0,
  }
}

/**
 * Scores an attempt. Unanswered questions earn zero — the score is never
 * negative. Open answers are matched against the accepted answers of *all*
 * locales, so a mid-attempt language switch cannot cost points.
 */
export const scoreAttempt = (exam: Exam, attempt: ExamAttempt): ExamScore => {
  const locale = attempt.locale

  const results = attempt.questionOrder
    .map((questionId) => buildQuestionResult(exam, attempt, locale, questionId))
    .filter((result): result is QuestionResult => result !== null)

  const totalPoints = results.reduce((sum, result) => sum + result.points, 0)
  const earnedPoints = results.reduce(
    (sum, result) => sum + result.earnedPoints,
    0,
  )

  const closedResults = results.filter(
    (result) => result.type === 'single_choice',
  )
  const openResults = results.filter((result) => result.type === 'open_text')

  const percentage =
    totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  const passScore = Math.ceil((totalPoints * exam.config.passPercentage) / 100)

  return {
    totalPoints,
    earnedPoints,
    percentage,
    passScore,
    passed: earnedPoints >= passScore,
    questions: {
      correct: results.filter((result) => result.isCorrect).length,
      total: results.length,
    },
    closed: {
      correct: closedResults.filter((result) => result.isCorrect).length,
      total: closedResults.length,
    },
    open: {
      correct: openResults.filter((result) => result.isCorrect).length,
      total: openResults.length,
    },
    results,
  }
}

/** Question ids that have no usable answer yet. */
export const getUnansweredQuestionIds = (attempt: ExamAttempt): string[] =>
  attempt.questionOrder.filter(
    (questionId) => toTrimmedAnswer(attempt.answers[questionId]) === null,
  )

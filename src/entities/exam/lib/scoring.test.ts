import type {
  Exam,
  ExamAttempt,
  ExamDocument,
  ExamLocale,
} from '../model/types'
import { getUnansweredQuestionIds, scoreAttempt } from './scoring'
import { describe, expect, it } from 'vitest'

const buildDocument = (locale: ExamLocale): ExamDocument => ({
  id: 'test-exam',
  version: 1,
  config: {
    durationMinutes: 45,
    totalQuestions: 3,
    passPercentage: 60,
    maxViolations: 3,
    shuffleQuestions: false,
    shuffleOptions: false,
  },
  questions: [
    {
      id: 'q-001',
      order: 1,
      type: 'single_choice',
      points: 1,
      correctOptionId: 'b',
      prompt: `prompt-1-${locale}`,
      options: [
        { id: 'a', text: `a-${locale}` },
        { id: 'b', text: `b-${locale}` },
        { id: 'c', text: `c-${locale}` },
        { id: 'd', text: `d-${locale}` },
      ],
    },
    {
      id: 'q-002',
      order: 2,
      type: 'single_choice',
      points: 1,
      correctOptionId: 'c',
      prompt: `prompt-2-${locale}`,
      options: [
        { id: 'a', text: `a-${locale}` },
        { id: 'b', text: `b-${locale}` },
        { id: 'c', text: `c-${locale}` },
        { id: 'd', text: `d-${locale}` },
      ],
    },
    {
      id: 'q-003',
      order: 3,
      type: 'open_text',
      points: 2,
      prompt: `prompt-3-${locale}`,
      acceptedAnswers: locale === 'uz' ? ['virtual dom'] : ['виртуальный dom'],
    },
  ],
})

const exam: Exam = {
  id: 'test-exam',
  version: 1,
  config: buildDocument('uz').config,
  locales: { uz: buildDocument('uz'), ru: buildDocument('ru') },
}

const buildAttempt = (overrides: Partial<ExamAttempt> = {}): ExamAttempt => ({
  examId: exam.id,
  examVersion: exam.version,
  participantName: 'Test Participant',
  locale: 'uz',
  startedAt: 0,
  endsAt: 1000,
  submittedAt: null,
  maxViolations: 3,
  questionOrder: ['q-001', 'q-002', 'q-003'],
  optionOrder: {},
  answers: {},
  currentIndex: 0,
  violations: [],
  status: 'in_progress',
  submitReason: null,
  ...overrides,
})

describe('scoreAttempt', () => {
  it('awards full points for a fully correct attempt', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({
        answers: { 'q-001': 'b', 'q-002': 'c', 'q-003': 'Virtual DOM' },
      }),
    )

    expect(score.earnedPoints).toBe(4)
    expect(score.totalPoints).toBe(4)
    expect(score.percentage).toBe(100)
    expect(score.passed).toBe(true)
    expect(score.closed).toStrictEqual({ correct: 2, total: 2 })
    expect(score.open).toStrictEqual({ correct: 1, total: 1 })
    expect(score.questions).toStrictEqual({ correct: 3, total: 3 })
  })

  it('counts questions independently of their point weights', () => {
    // The open question is worth 2 points, so points and question counts differ.
    const score = scoreAttempt(
      exam,
      buildAttempt({ answers: { 'q-001': 'b', 'q-003': 'virtual dom' } }),
    )

    expect(score.totalPoints).toBe(4)
    expect(score.earnedPoints).toBe(3)
    expect(score.questions).toStrictEqual({ correct: 2, total: 3 })
  })

  it('scores an empty attempt as zero, never negative', () => {
    const score = scoreAttempt(exam, buildAttempt())

    expect(score.earnedPoints).toBe(0)
    expect(score.percentage).toBe(0)
    expect(score.passed).toBe(false)
    expect(score.closed).toStrictEqual({ correct: 0, total: 2 })
    expect(score.open).toStrictEqual({ correct: 0, total: 1 })
  })

  it('gives no points for wrong answers', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({
        answers: { 'q-001': 'a', 'q-002': 'd', 'q-003': 'shadow dom' },
      }),
    )

    expect(score.earnedPoints).toBe(0)
    expect(score.results.every((result) => result.earnedPoints === 0)).toBe(
      true,
    )
  })

  it('weights open questions by their points', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ answers: { 'q-003': 'virtual dom' } }),
    )

    expect(score.earnedPoints).toBe(2)
    expect(score.percentage).toBe(50)
  })

  it('accepts an open answer from the other locale', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ locale: 'uz', answers: { 'q-003': 'Виртуальный DOM' } }),
    )

    expect(score.open.correct).toBe(1)
  })

  it('derives passScore from passPercentage and compares against it', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ answers: { 'q-001': 'b', 'q-002': 'c' } }),
    )

    // 60% of 4 points, rounded up
    expect(score.passScore).toBe(3)
    expect(score.earnedPoints).toBe(2)
    expect(score.passed).toBe(false)
  })

  it('rounds the percentage to a whole number', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ answers: { 'q-001': 'b' } }),
    )

    expect(score.percentage).toBe(25)
  })

  it('reports the participant answer and the correct answer per question', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ answers: { 'q-001': 'a', 'q-003': '  virtual dom  ' } }),
    )

    expect(score.results[0]).toMatchObject({
      questionId: 'q-001',
      participantAnswer: 'a-uz',
      correctAnswer: 'b-uz',
      isCorrect: false,
    })
    expect(score.results[1]).toMatchObject({
      questionId: 'q-002',
      participantAnswer: null,
      isCorrect: false,
    })
    expect(score.results[2]).toMatchObject({
      questionId: 'q-003',
      participantAnswer: 'virtual dom',
      correctAnswer: 'virtual dom',
      isCorrect: true,
    })
  })

  it('localises prompts and options through the attempt locale', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ locale: 'ru', answers: { 'q-001': 'b' } }),
    )

    expect(score.results[0].prompt).toBe('prompt-1-ru')
    expect(score.results[0].participantAnswer).toBe('b-ru')
  })

  it('follows the attempt question order', () => {
    const score = scoreAttempt(
      exam,
      buildAttempt({ questionOrder: ['q-003', 'q-001', 'q-002'] }),
    )

    expect(score.results.map((result) => result.questionId)).toStrictEqual([
      'q-003',
      'q-001',
      'q-002',
    ])
  })
})

describe('getUnansweredQuestionIds', () => {
  it('lists questions with no answer', () => {
    expect(getUnansweredQuestionIds(buildAttempt())).toStrictEqual([
      'q-001',
      'q-002',
      'q-003',
    ])
  })

  it('treats whitespace-only text as unanswered', () => {
    const unanswered = getUnansweredQuestionIds(
      buildAttempt({ answers: { 'q-001': 'a', 'q-003': '   ' } }),
    )

    expect(unanswered).toStrictEqual(['q-002', 'q-003'])
  })

  it('returns an empty list when everything is answered', () => {
    const unanswered = getUnansweredQuestionIds(
      buildAttempt({
        answers: { 'q-001': 'a', 'q-002': 'b', 'q-003': 'anything' },
      }),
    )

    expect(unanswered).toStrictEqual([])
  })
})

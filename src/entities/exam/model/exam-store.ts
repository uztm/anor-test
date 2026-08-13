import { getQuestions, isChoiceQuestion } from '../lib/load-exam'
import type {
  Exam,
  ExamAttempt,
  ExamLocale,
  IExamStore,
  OptionId,
  StartAttemptParams,
} from './types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const EXAM_STORAGE_KEY = 'exam_attempt'

const MINUTE_IN_MS = 60_000

const randomIndex = (maxExclusive: number): number => {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return buffer[0] % maxExclusive
}

/** Fisher–Yates on a copy; the caller's array is never touched. */
const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index--) {
    const swapWith = randomIndex(index + 1)
    ;[result[index], result[swapWith]] = [result[swapWith], result[index]]
  }

  return result
}

/**
 * Freezes the presentation order at start time so a refresh cannot reshuffle
 * the exam under the participant.
 */
const buildOrder = (
  exam: Exam,
  locale: ExamLocale,
): Pick<ExamAttempt, 'questionOrder' | 'optionOrder'> => {
  const questions = getQuestions(exam, locale)

  const ordered = exam.config.shuffleQuestions ? shuffle(questions) : questions

  const optionOrder = questions.reduce<Record<string, OptionId[]>>(
    (accumulator, question) => {
      if (isChoiceQuestion(question)) {
        const ids = question.options.map((option) => option.id)
        accumulator[question.id] = exam.config.shuffleOptions
          ? shuffle(ids)
          : ids
      }
      return accumulator
    },
    {},
  )

  return {
    questionOrder: ordered.map((question) => question.id),
    optionOrder,
  }
}

const createAttempt = ({
  exam,
  participantName,
  locale,
}: StartAttemptParams): ExamAttempt => {
  const startedAt = Date.now()

  return {
    examId: exam.id,
    examVersion: exam.version,
    participantName: participantName.trim(),
    locale,
    startedAt,
    endsAt: startedAt + exam.config.durationMinutes * MINUTE_IN_MS,
    submittedAt: null,
    maxViolations: exam.config.maxViolations,
    ...buildOrder(exam, locale),
    answers: {},
    currentIndex: 0,
    violations: [],
    status: 'in_progress',
    submitReason: null,
  }
}

export const useExamStore = create<IExamStore>()(
  persist(
    immer((set) => ({
      attempt: null,

      startAttempt: (params) =>
        set((state) => {
          state.attempt = createAttempt(params)
        }),

      setAnswer: (questionId, value) =>
        set((state) => {
          if (state.attempt?.status !== 'in_progress') {
            return
          }
          state.attempt.answers[questionId] = value
        }),

      goToIndex: (index) =>
        set((state) => {
          if (!state.attempt) {
            return
          }
          const lastIndex = state.attempt.questionOrder.length - 1
          state.attempt.currentIndex = Math.min(Math.max(index, 0), lastIndex)
        }),

      goToNext: () =>
        set((state) => {
          if (!state.attempt) {
            return
          }
          const lastIndex = state.attempt.questionOrder.length - 1
          state.attempt.currentIndex = Math.min(
            state.attempt.currentIndex + 1,
            lastIndex,
          )
        }),

      goToPrevious: () =>
        set((state) => {
          if (!state.attempt) {
            return
          }
          state.attempt.currentIndex = Math.max(
            state.attempt.currentIndex - 1,
            0,
          )
        }),

      setLocale: (locale) =>
        set((state) => {
          if (!state.attempt) {
            return
          }
          state.attempt.locale = locale
        }),

      logViolation: (type) =>
        set((state) => {
          if (state.attempt?.status !== 'in_progress') {
            return
          }

          state.attempt.violations.push({ type, at: Date.now() })

          if (state.attempt.violations.length >= state.attempt.maxViolations) {
            state.attempt.status = 'submitted'
            state.attempt.submittedAt = Date.now()
            state.attempt.submitReason = 'violation_limit'
          }
        }),

      submit: (reason) =>
        set((state) => {
          if (state.attempt?.status !== 'in_progress') {
            return
          }
          state.attempt.status = 'submitted'
          state.attempt.submittedAt = Date.now()
          state.attempt.submitReason = reason
        }),
    })),
    {
      name: EXAM_STORAGE_KEY,
      /*
       * localStorage, not sessionStorage: the submitted attempt has to outlive
       * the tab so a participant cannot simply reopen the page and sit the
       * exam again. This is per browser profile only — a different browser,
       * a private window or cleared storage all bypass it. Enforcing one
       * attempt per person needs a backend.
       */
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ attempt: state.attempt }) as IExamStore,
    },
  ),
)

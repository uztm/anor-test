export type ExamLocale = 'uz' | 'ru'

export type OptionId = 'a' | 'b' | 'c' | 'd'

export type QuestionType = 'single_choice' | 'open_text'

export interface ExamConfig {
  durationMinutes: number
  totalQuestions: number
  passPercentage: number
  maxViolations: number
  shuffleQuestions: boolean
  shuffleOptions: boolean
}

export interface QuestionOption {
  id: OptionId
  text: string
}

export interface ChoiceQuestion {
  id: string
  order: number
  type: 'single_choice'
  points: number
  correctOptionId: OptionId
  prompt: string
  options: QuestionOption[]
}

export interface OpenQuestion {
  id: string
  order: number
  type: 'open_text'
  points: number
  prompt: string
  acceptedAnswers: string[]
}

export type ExamQuestion = ChoiceQuestion | OpenQuestion

/** Shape of a single locale file (`model/uz/exam.json`, `model/ru/exam.json`). */
export interface ExamDocument {
  id: string
  version: number
  config: ExamConfig
  questions: ExamQuestion[]
}

/** Both locale files merged after validation confirmed they agree. */
export interface Exam {
  id: string
  version: number
  config: ExamConfig
  locales: Record<ExamLocale, ExamDocument>
}

export type ViolationType =
  | 'fullscreen_exit'
  | 'tab_hidden'
  | 'window_blur'
  | 'reload'

export interface Violation {
  type: ViolationType
  at: number
}

export type ExamStatus = 'in_progress' | 'submitted'

export type SubmitReason =
  | 'manual'
  | 'timeout'
  | 'violation_limit'
  | 'left_exam'

export interface ExamAttempt {
  examId: string
  examVersion: number
  participantName: string
  locale: ExamLocale
  startedAt: number
  /** Absolute expiry timestamp, so a refresh can never extend the attempt. */
  endsAt: number
  submittedAt: number | null
  maxViolations: number
  /** Question ids in presentation order, frozen at start. */
  questionOrder: string[]
  /** Option ids per question in presentation order, frozen at start. */
  optionOrder: Record<string, OptionId[]>
  /** questionId -> selected option id, or free text for open questions. */
  answers: Record<string, string>
  currentIndex: number
  violations: Violation[]
  status: ExamStatus
  submitReason: SubmitReason | null
}

export interface StartAttemptParams {
  exam: Exam
  participantName: string
  locale: ExamLocale
}

export interface IExamStore {
  attempt: ExamAttempt | null
  startAttempt: (params: StartAttemptParams) => void
  setAnswer: (questionId: string, value: string) => void
  goToIndex: (index: number) => void
  goToNext: () => void
  goToPrevious: () => void
  setLocale: (locale: ExamLocale) => void
  logViolation: (type: ViolationType) => void
  submit: (reason: SubmitReason) => void
  reset: () => void
}

export interface QuestionResult {
  questionId: string
  order: number
  type: QuestionType
  prompt: string
  /** Rendered answer text, already localised. `null` when unanswered. */
  participantAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  points: number
  earnedPoints: number
}

export interface ScoreBreakdown {
  correct: number
  total: number
}

export interface ExamScore {
  totalPoints: number
  earnedPoints: number
  percentage: number
  passScore: number
  passed: boolean
  closed: ScoreBreakdown
  open: ScoreBreakdown
  results: QuestionResult[]
}

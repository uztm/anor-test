import type { Exam } from '../model/types'
import { loadExam } from './load-exam'

interface SafeExamResult {
  exam: Exam | null
  error: Error | null
}

/**
 * Loads the exam without throwing, so a page can render a readable error
 * instead of blowing up the whole app.
 */
export const safeLoadExam = (): SafeExamResult => {
  try {
    return { exam: loadExam(), error: null }
  } catch (error) {
    return {
      exam: null,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

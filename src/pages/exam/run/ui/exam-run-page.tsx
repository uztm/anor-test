import type { ExamLocale } from 'entities/exam'
import {
  ExamDataError,
  getQuestionById,
  getUnansweredQuestionIds,
  QuestionCard,
  safeLoadExam,
  useExamStore,
} from 'entities/exam'
import { LockdownWarningModal, useExamLockdown } from 'features/exam-lockdown'
import { SubmitConfirmModal } from 'features/submit-exam'
import { ExamHeader } from 'widgets/exam/header'
import { QuestionNavigator } from 'widgets/exam/navigator'

import classes from './exam-run-page.module.css'

import { Button, Container, Grid, Group, Stack } from '@mantine/core'
import { RiArrowLeftLine, RiArrowRightLine, RiFlagLine } from '@remixicon/react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

export const ExamRunPage = () => {
  const { t, i18n } = useTranslation('exam')
  const { exam, error } = safeLoadExam()

  const attempt = useExamStore((state) => state.attempt)
  const setAnswer = useExamStore((state) => state.setAnswer)
  const setLocale = useExamStore((state) => state.setLocale)
  const goToIndex = useExamStore((state) => state.goToIndex)
  const goToNext = useExamStore((state) => state.goToNext)
  const goToPrevious = useExamStore((state) => state.goToPrevious)
  const submit = useExamStore((state) => state.submit)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const isActive = attempt?.status === 'in_progress'
  const { isWarningOpen, closeWarning } = useExamLockdown({ isActive })

  const handleExpire = useCallback(() => {
    submit('timeout')
  }, [submit])

  if (!exam) {
    return <ExamDataError error={error} />
  }

  if (!attempt) {
    return <Navigate to={'/exam'} replace={true} />
  }

  if (attempt.status === 'submitted') {
    return <Navigate to={'/exam/result'} replace={true} />
  }

  // The question set was swapped underneath a live attempt — the safest
  // outcome is to send the participant back rather than score against the
  // wrong data. The welcome screen replaces the stale attempt on start.
  if (attempt.examId !== exam.id || attempt.examVersion !== exam.version) {
    return <Navigate to={'/exam'} replace={true} />
  }

  const total = attempt.questionOrder.length
  const questionId = attempt.questionOrder[attempt.currentIndex]
  const question = getQuestionById(exam, attempt.locale, questionId)

  const unansweredIds = getUnansweredQuestionIds(attempt)
  const answeredIds = new Set(
    attempt.questionOrder.filter((id) => !unansweredIds.includes(id)),
  )

  const isLastQuestion = attempt.currentIndex === total - 1

  const handleLocaleChange = (locale: ExamLocale) => {
    setLocale(locale)
    void i18n.changeLanguage(locale)
  }

  const handleAnswerChange = (value: string) => {
    setAnswer(questionId, value)
  }

  return (
    <Container size={'lg'} py={'md'} className={classes.page}>
      <Stack gap={'md'}>
        <ExamHeader
          attempt={attempt}
          answeredCount={answeredIds.size}
          onExpire={handleExpire}
          onLocaleChange={handleLocaleChange}
        />

        <Grid gap={'md'}>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap={'md'}>
              {question && (
                <QuestionCard
                  question={question}
                  position={attempt.currentIndex + 1}
                  total={total}
                  optionOrder={attempt.optionOrder[questionId]}
                  value={attempt.answers[questionId]}
                  onChange={handleAnswerChange}
                />
              )}

              <Group justify={'space-between'}>
                <Button
                  variant={'default'}
                  leftSection={<RiArrowLeftLine size={16} />}
                  disabled={attempt.currentIndex === 0}
                  onClick={goToPrevious}
                >
                  {t('navigation.previous')}
                </Button>

                {isLastQuestion ? (
                  <Button
                    color={'red'}
                    leftSection={<RiFlagLine size={16} />}
                    onClick={() => {
                      setIsConfirmOpen(true)
                    }}
                  >
                    {t('navigation.finish')}
                  </Button>
                ) : (
                  <Button
                    rightSection={<RiArrowRightLine size={16} />}
                    onClick={goToNext}
                  >
                    {t('navigation.next')}
                  </Button>
                )}
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <QuestionNavigator
              questionIds={attempt.questionOrder}
              answeredIds={answeredIds}
              currentIndex={attempt.currentIndex}
              onSelect={goToIndex}
            />
          </Grid.Col>
        </Grid>
      </Stack>

      <SubmitConfirmModal
        opened={isConfirmOpen}
        unansweredCount={unansweredIds.length}
        onClose={() => {
          setIsConfirmOpen(false)
        }}
        onConfirm={() => {
          setIsConfirmOpen(false)
          submit('manual')
        }}
      />

      <LockdownWarningModal
        opened={isWarningOpen}
        violationCount={attempt.violations.length}
        maxViolations={attempt.maxViolations}
        onReturn={closeWarning}
        onLeave={() => {
          closeWarning()
          submit('left_exam')
        }}
      />
    </Container>
  )
}

import {
  ExamDataError,
  safeLoadExam,
  scoreAttempt,
  useExamStore,
} from 'entities/exam'
import { exitFullscreen } from 'shared/lib'
import { ExamCertificate } from 'widgets/exam/certificate'
import {
  ResultReaction,
  ResultReview,
  ResultSummary,
} from 'widgets/exam/result'

import { Button, Container, Group, Stack, Text } from '@mantine/core'
import { RiDownloadLine, RiLogoutBoxLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'

export const ExamResultPage = () => {
  const { t } = useTranslation('exam')
  const navigate = useNavigate()
  const { exam, error } = safeLoadExam()

  const attempt = useExamStore((state) => state.attempt)

  if (!exam) {
    return <ExamDataError error={error} />
  }

  if (!attempt) {
    return <Navigate to={'/exam'} replace={true} />
  }

  if (attempt.status !== 'submitted') {
    return <Navigate to={'/exam/run'} replace={true} />
  }

  const score = scoreAttempt(exam, attempt)

  // The submitted attempt is deliberately kept: it is the record that stops a
  // second sitting, and it keeps the certificate available for re-download.
  const handleExit = async () => {
    await exitFullscreen()
    await navigate('/exam')
  }

  // The print stylesheet isolates the certificate and forces A4 landscape, so
  // the browser's own "Save as PDF" destination produces the final file.
  const handleDownload = () => {
    window.print()
  }

  return (
    <Container size={'md'} py={'xl'}>
      <Stack gap={'lg'}>
        <ExamCertificate attempt={attempt} score={score} />

        <Stack gap={4} align={'center'}>
          <Button
            size={'md'}
            leftSection={<RiDownloadLine size={16} />}
            onClick={handleDownload}
          >
            {t('certificate.download')}
          </Button>
          <Text size={'xs'} c={'dimmed'} ta={'center'}>
            {t('certificate.printHint')}
          </Text>
        </Stack>
        <ResultReaction earnedPoints={score.earnedPoints} />
        <ResultSummary attempt={attempt} score={score} />
        <ResultReview results={score.results} />

        <Group justify={'flex-end'}>
          <Button
            size={'md'}
            variant={'default'}
            leftSection={<RiLogoutBoxLine size={16} />}
            onClick={() => {
              void handleExit()
            }}
          >
            {t('result.exit')}
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}

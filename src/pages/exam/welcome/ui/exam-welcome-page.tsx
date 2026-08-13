import { ExamDataError, safeLoadExam, useExamStore } from 'entities/exam'
import { StartExamForm } from 'features/start-exam'
import { Logo } from 'shared/ui'

import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Container,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { RiCheckDoubleLine, RiFileTextLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'

export const ExamWelcomePage = () => {
  const { t } = useTranslation('exam')
  const navigate = useNavigate()
  const { exam, error } = safeLoadExam()
  const attempt = useExamStore((state) => state.attempt)

  if (!exam) {
    return <ExamDataError error={error} />
  }

  // An attempt from an older exam version never blocks anything — starting a
  // new one simply overwrites it.
  const isCurrentExam =
    attempt?.examId === exam.id && attempt.examVersion === exam.version

  // An attempt already in progress may not be restarted — that would be a way
  // to shed accumulated violations.
  if (isCurrentExam && attempt.status === 'in_progress') {
    return <Navigate to={'/exam/run'} replace={true} />
  }

  const isCompleted = isCurrentExam && attempt.status === 'submitted'

  return (
    <Container size={'sm'} py={'xl'}>
      <Center mih={'80vh'}>
        <Stack gap={'lg'} w={'100%'}>
          <Stack gap={'xs'}>
            <Box w={180}>
              <Logo />
            </Box>
            <Text size={'xs'} fw={600} tt={'uppercase'} c={'dimmed'}>
              {t('brand.track')}
            </Text>
          </Stack>

          <Stack gap={4}>
            <Title order={1} fz={'h2'}>
              {t('welcome.title')}
            </Title>
            <Text c={'dimmed'}>{t('welcome.subtitle')}</Text>
          </Stack>

          {isCompleted ? (
            <Card withBorder={true} radius={'md'} padding={'lg'}>
              <Stack gap={'md'}>
                <Alert
                  variant={'light'}
                  color={'teal'}
                  icon={<RiCheckDoubleLine />}
                  title={t('alreadyCompleted.title')}
                >
                  <Stack gap={4}>
                    <Text size={'sm'}>{t('alreadyCompleted.message')}</Text>
                    <Text size={'sm'} fw={600}>
                      {attempt.participantName}
                    </Text>
                  </Stack>
                </Alert>

                <Button
                  size={'md'}
                  leftSection={<RiFileTextLine size={16} />}
                  onClick={() => navigate('/exam/result')}
                >
                  {t('alreadyCompleted.viewResult')}
                </Button>
              </Stack>
            </Card>
          ) : (
            <Card withBorder={true} radius={'md'} padding={'lg'}>
              <StartExamForm exam={exam} />
            </Card>
          )}
        </Stack>
      </Center>
    </Container>
  )
}

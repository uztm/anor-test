import { ExamDataError, safeLoadExam, useExamStore } from 'entities/exam'
import { StartExamForm } from 'features/start-exam'
import { Logo } from 'shared/ui'

import { Box, Card, Center, Container, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

export const ExamWelcomePage = () => {
  const { t } = useTranslation('exam')
  const { exam, error } = safeLoadExam()
  const attempt = useExamStore((state) => state.attempt)

  if (!exam) {
    return <ExamDataError error={error} />
  }

  // An attempt already in progress may not be restarted — that would be a way
  // to shed accumulated violations. An attempt left over from a different
  // exam version is ignored and simply overwritten on start.
  const isResumable =
    attempt?.status === 'in_progress' &&
    attempt.examId === exam.id &&
    attempt.examVersion === exam.version

  if (isResumable) {
    return <Navigate to={'/exam/run'} replace={true} />
  }

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

          <Card withBorder={true} radius={'md'} padding={'lg'}>
            <StartExamForm exam={exam} />
          </Card>
        </Stack>
      </Center>
    </Container>
  )
}

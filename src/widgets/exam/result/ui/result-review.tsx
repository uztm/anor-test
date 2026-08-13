import type { QuestionResult } from 'entities/exam'

import { Badge, Card, Group, Paper, Stack, Text } from '@mantine/core'
import { RiCheckLine, RiCloseLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

interface ResultReviewProps {
  results: QuestionResult[]
}

interface ReviewRowProps {
  result: QuestionResult
}

const ReviewRow = ({ result }: Readonly<ReviewRowProps>) => {
  const { t } = useTranslation('exam')

  return (
    <Paper withBorder={true} radius={'md'} p={'md'}>
      <Stack gap={'xs'}>
        <Group justify={'space-between'} align={'flex-start'} wrap={'nowrap'}>
          <Text size={'sm'} fw={500}>
            {`${result.order}. ${result.prompt}`}
          </Text>
          <Badge
            variant={'light'}
            radius={'sm'}
            color={result.isCorrect ? 'teal' : 'red'}
            leftSection={
              result.isCorrect ? (
                <RiCheckLine size={14} />
              ) : (
                <RiCloseLine size={14} />
              )
            }
          >
            {`${result.earnedPoints} / ${result.points}`}
          </Badge>
        </Group>

        <Stack gap={2}>
          <Text size={'xs'} c={'dimmed'}>
            {t('result.yourAnswer')}
          </Text>
          <Text size={'sm'} c={result.isCorrect ? 'teal' : 'red'}>
            {result.participantAnswer ?? t('result.noAnswer')}
          </Text>
        </Stack>

        {!result.isCorrect && (
          <Stack gap={2}>
            <Text size={'xs'} c={'dimmed'}>
              {t('result.correctAnswer')}
            </Text>
            <Text size={'sm'}>{result.correctAnswer}</Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export const ResultReview = ({ results }: Readonly<ResultReviewProps>) => {
  const { t } = useTranslation('exam')

  return (
    <Card withBorder={true} radius={'md'} padding={'lg'}>
      <Stack gap={'md'}>
        <Text fw={600}>{t('result.review')}</Text>
        <Stack gap={'sm'}>
          {results.map((result) => (
            <ReviewRow key={result.questionId} result={result} />
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

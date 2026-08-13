import type {
  ExamAttempt,
  ExamLocale,
  ExamScore,
  SubmitReason,
} from 'entities/exam'

import {
  Badge,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface ResultSummaryProps {
  attempt: ExamAttempt
  score: ExamScore
}

/** Literal keys, so the typed `t()` can resolve them. */
const REASON_KEYS = {
  manual: 'result.reason.manual',
  timeout: 'result.reason.timeout',
  violation_limit: 'result.reason.violationLimit',
  left_exam: 'result.reason.leftExam',
} as const satisfies Record<SubmitReason, string>

const LOCALE_KEYS = {
  uz: 'welcome.localeUz',
  ru: 'welcome.localeRu',
} as const satisfies Record<ExamLocale, string>

const MINUTE_IN_MS = 60_000

const formatDuration = (durationMs: number): string => {
  const totalMinutes = Math.floor(durationMs / MINUTE_IN_MS)
  const seconds = Math.floor((durationMs % MINUTE_IN_MS) / 1000)

  return `${totalMinutes}:${String(seconds).padStart(2, '0')}`
}

interface StatProps {
  label: string
  value: string
}

const Stat = ({ label, value }: Readonly<StatProps>) => (
  <Stack gap={2}>
    <Text size={'xs'} c={'dimmed'} tt={'uppercase'} fw={600}>
      {label}
    </Text>
    <Text fw={500}>{value}</Text>
  </Stack>
)

export const ResultSummary = ({
  attempt,
  score,
}: Readonly<ResultSummaryProps>) => {
  const { t } = useTranslation('exam')

  const finishedAt = attempt.submittedAt ?? attempt.endsAt
  const timeSpent = formatDuration(finishedAt - attempt.startedAt)

  return (
    <Card withBorder={true} radius={'md'} padding={'lg'}>
      <Stack gap={'lg'}>
        <Group justify={'space-between'} align={'flex-start'} wrap={'wrap'}>
          <Stack gap={4}>
            <Title order={2} fz={'h3'}>
              {t('result.title')}
            </Title>
            <Text size={'sm'} c={'dimmed'}>
              {t(REASON_KEYS[attempt.submitReason ?? 'manual'])}
            </Text>
          </Stack>

          <Badge
            size={'lg'}
            radius={'sm'}
            color={score.passed ? 'teal' : 'red'}
            variant={'filled'}
          >
            {score.passed ? t('result.passed') : t('result.failed')}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={'md'}>
          <Stat
            label={t('result.participant')}
            value={attempt.participantName}
          />
          <Stat
            label={t('result.language')}
            value={t(LOCALE_KEYS[attempt.locale])}
          />
          <Stat label={t('result.timeSpent')} value={timeSpent} />
          <Stat
            label={t('result.violations')}
            value={String(attempt.violations.length)}
          />
        </SimpleGrid>

        <Stack gap={'xs'}>
          <Group justify={'space-between'} align={'flex-end'}>
            <Text fw={600}>
              {t('result.score', {
                earned: score.earnedPoints,
                total: score.totalPoints,
              })}
            </Text>
            <Text size={'xl'} fw={700} c={score.passed ? 'teal' : 'red'}>
              {`${score.percentage}%`}
            </Text>
          </Group>
          <Progress
            value={score.percentage}
            size={'lg'}
            radius={'xl'}
            color={score.passed ? 'teal' : 'red'}
          />
          <Text size={'xs'} c={'dimmed'}>
            {t('result.passScore', {
              score: score.passScore,
              percentage: score.percentage,
            })}
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={'md'}>
          <Stat
            label={t('result.closedQuestions')}
            value={`${score.closed.correct} / ${score.closed.total}`}
          />
          <Stat
            label={t('result.openQuestions')}
            value={`${score.open.correct} / ${score.open.total}`}
          />
        </SimpleGrid>
      </Stack>
    </Card>
  )
}
